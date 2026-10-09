const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const BACKUP_DIR = path.join(__dirname, "../../backup_images");
const MANIFEST_PATH = path.join(BACKUP_DIR, "manifest.json");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_BASE_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".heic": "image/heic",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
  };
  return map[ext] || "application/octet-stream";
}

async function uploadFileToR2(localPath, key) {
  const fileBuffer = fs.readFileSync(localPath);
  const mimeType = getMimeType(localPath);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await s3.send(command);
  return `${PUBLIC_BASE_URL}/${key}`;
}

async function main() {
  console.log("=== Step 1: Uploading Backed-up Images to Cloudflare R2 ===");
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found at ${MANIFEST_PATH}`);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  console.log(`Loaded manifest with ${manifest.length} items.`);

  const urlReplacementMap = new Map(); // oldUrl -> newR2Url
  let uploadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  const concurrency = 15;
  for (let i = 0; i < manifest.length; i += concurrency) {
    const chunk = manifest.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async (item) => {
        if (!item.exists || !fs.existsSync(item.localPath)) {
          skippedCount++;
          return;
        }

        // Use the relative path as the R2 key (e.g. villa-lemon/packages/xyz.jpg)
        const key = item.relPath.replace(/^\/+/, "");
        try {
          const newUrl = await uploadFileToR2(item.localPath, key);
          urlReplacementMap.set(item.url, newUrl);
          uploadedCount++;
        } catch (err) {
          console.error(`Failed to upload ${key}:`, err.message);
          failedCount++;
        }
      })
    );
    const progress = Math.min(i + concurrency, manifest.length);
    process.stdout.write(`Upload Progress: ${progress}/${manifest.length} (Uploaded: ${uploadedCount}, Skipped: ${skippedCount}, Failed: ${failedCount})\r`);
  }

  console.log(`\n\nR2 Upload Finished: ${uploadedCount} uploaded, ${skippedCount} skipped, ${failedCount} failed.`);
  console.log(`Created replacement map for ${urlReplacementMap.size} URLs.`);

  console.log("\n=== Step 2: Updating MongoDB Collections ===");
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  let totalDocsUpdated = 0;
  let totalFieldsUpdated = 0;

  for (const col of collections) {
    const colName = col.name;
    const docs = await db.collection(colName).find({}).toArray();
    let colUpdatedDocs = 0;

    for (const doc of docs) {
      let docStr = JSON.stringify(doc);
      let docChanged = false;

      for (const [oldUrl, newUrl] of urlReplacementMap.entries()) {
        if (docStr.includes(oldUrl)) {
          // Replace all occurrences of oldUrl with newUrl
          docStr = docStr.split(oldUrl).join(newUrl);
          docChanged = true;
          totalFieldsUpdated++;
        }
      }

      if (docChanged) {
        const updatedDoc = JSON.parse(docStr);
        const { _id, ...fieldsToUpdate } = updatedDoc;
        await db.collection(colName).updateOne({ _id: doc._id }, { $set: fieldsToUpdate });
        colUpdatedDocs++;
        totalDocsUpdated++;
      }
    }

    if (colUpdatedDocs > 0) {
      console.log(`Updated ${colUpdatedDocs} documents in collection '${colName}'`);
    }
  }

  console.log(`\nMongoDB Migration Complete!`);
  console.log(`Total Documents Updated: ${totalDocsUpdated}`);
  console.log(`Total URL References Replaced: ${totalFieldsUpdated}`);

  // Save the mapping for future reference
  const mapObj = Object.fromEntries(urlReplacementMap);
  fs.writeFileSync(path.join(BACKUP_DIR, "url_replacement_map.json"), JSON.stringify(mapObj, null, 2));
  console.log(`Mapping saved to ${path.join(BACKUP_DIR, "url_replacement_map.json")}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
