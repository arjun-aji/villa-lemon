const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const BACKUP_DIR = path.join(__dirname, "../../backup_images");

async function main() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const cols = await db.listCollections().toArray();
  const urlMap = new Map(); // originalUrl -> relativePath

  for (const c of cols) {
    const docs = await db.collection(c.name).find({}).toArray();
    for (const d of docs) {
      const str = JSON.stringify(d);
      const matches = str.match(/https:\/\/res\.cloudinary\.com\/d6qmn2vu\/[^\"]+/g) || [];
      for (const url of matches) {
        if (!urlMap.has(url)) {
          // Parse url path to extract folder structure:
          // e.g. https://res.cloudinary.com/d6qmn2vu/image/upload/v1787377643/villa-lemon/yoga/gkqdnus6tz77rmdsxgp5.jpg
          const parts = url.split("/upload/");
          let relPath = "";
          if (parts.length > 1) {
            // Remove version tag (v123456789/)
            relPath = parts[1].replace(/^v\d+\//, "");
          } else {
            relPath = path.basename(url);
          }
          urlMap.set(url, relPath);
        }
      }
    }
  }

  console.log(`Found ${urlMap.size} unique Cloudinary URLs. Starting download to ${BACKUP_DIR}...`);

  let downloaded = 0;
  let failed = 0;
  let alreadyExists = 0;
  let totalBytes = 0;

  const entries = Array.from(urlMap.entries());
  const concurrency = 10;

  for (let i = 0; i < entries.length; i += concurrency) {
    const batch = entries.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async ([url, relPath]) => {
        const destFile = path.join(BACKUP_DIR, relPath);
        const destDir = path.dirname(destFile);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        if (fs.existsSync(destFile) && fs.statSync(destFile).size > 0) {
          alreadyExists++;
          totalBytes += fs.statSync(destFile).size;
          return;
        }

        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`Failed ${res.status}: ${url}`);
            failed++;
            return;
          }
          const buffer = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(destFile, buffer);
          downloaded++;
          totalBytes += buffer.length;
        } catch (err) {
          console.error(`Error downloading ${url}:`, err.message);
          failed++;
        }
      })
    );
    const progress = Math.min(i + concurrency, entries.length);
    process.stdout.write(`Progress: ${progress}/${entries.length} (${downloaded} downloaded, ${alreadyExists} existed, ${failed} failed)\r`);
  }

  console.log(`\n\nBackup Complete!`);
  console.log(`Total Files: ${entries.length}`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Already Existed: ${alreadyExists}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total Downloaded Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);

  // Write mapping JSON for future upload script
  const manifest = Array.from(urlMap.entries()).map(([url, relPath]) => ({
    url,
    relPath,
    localPath: path.join(BACKUP_DIR, relPath),
    exists: fs.existsSync(path.join(BACKUP_DIR, relPath)),
  }));
  fs.writeFileSync(path.join(BACKUP_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Manifest saved to ${path.join(BACKUP_DIR, "manifest.json")}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Backup failed:", err);
  process.exit(1);
});
