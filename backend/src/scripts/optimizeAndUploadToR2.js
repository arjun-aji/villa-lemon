const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
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

async function optimizeBuffer(rawBuffer, ext) {
  const extension = ext.toLowerCase();
  try {
    if (extension === ".jpg" || extension === ".jpeg") {
      return await sharp(rawBuffer)
        .rotate()
        .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
    } else if (extension === ".png") {
      return await sharp(rawBuffer)
        .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 9 })
        .toBuffer();
    } else if (extension === ".webp") {
      return await sharp(rawBuffer)
        .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    }
  } catch (err) {
    // Fall back to original raw buffer if compression fails
  }
  return rawBuffer;
}

async function main() {
  console.log("=== Optimizing Images to Minimize Cloudflare R2 Storage ===");
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

  let totalOrigBytes = 0;
  let totalOptimizedBytes = 0;
  let optimizedCount = 0;

  const concurrency = 15;
  for (let i = 0; i < manifest.length; i += concurrency) {
    const chunk = manifest.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async (item) => {
        if (!item.exists || !fs.existsSync(item.localPath)) return;

        const origBuf = fs.readFileSync(item.localPath);
        const origSize = origBuf.length;
        totalOrigBytes += origSize;

        const ext = path.extname(item.localPath);
        const optBuf = await optimizeBuffer(origBuf, ext);
        const optSize = optBuf.length;
        totalOptimizedBytes += optSize;

        const key = item.relPath.replace(/^\/+/, "");
        const mimeType = getMimeType(item.localPath);

        const command = new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: optBuf,
          ContentType: mimeType,
          CacheControl: "public, max-age=31536000, immutable",
        });

        await s3.send(command);
        optimizedCount++;
      })
    );
    const progress = Math.min(i + concurrency, manifest.length);
    process.stdout.write(`Optimized & Uploaded: ${progress}/${manifest.length}\r`);
  }

  const origMB = (totalOrigBytes / (1024 * 1024)).toFixed(2);
  const optMB = (totalOptimizedBytes / (1024 * 1024)).toFixed(2);
  const savedMB = (origMB - optMB).toFixed(2);
  const pct = (((totalOrigBytes - totalOptimizedBytes) / totalOrigBytes) * 100).toFixed(1);

  console.log(`\n\n=== Storage Optimization Results ===`);
  console.log(`Original Storage:  ${origMB} MB`);
  console.log(`Optimized Storage: ${optMB} MB`);
  console.log(`Storage Saved:     ${savedMB} MB (${pct}% reduction!)`);
  console.log(`Files Processed:   ${optimizedCount}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
