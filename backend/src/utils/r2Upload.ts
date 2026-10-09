import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "villalemon";
const publicBaseUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.warn("[r2Storage]: Warning: Cloudflare R2 configuration variables are missing. File uploads will fail.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export interface UploadResult {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
}

/**
 * Optimizes an image buffer using Sharp:
 * - Resizes to max 1920x1920
 * - Strips unnecessary metadata but preserves orientation
 * - Converts to WebP (quality: 80) for 80-90% size reduction
 */
async function compressImage(
  buffer: Buffer,
  originalMimeType?: string
): Promise<{ buffer: Buffer; format: string; mimeType: string }> {
  // If it's a PDF or SVG, don't re-encode with sharp
  if (originalMimeType === "application/pdf") {
    return { buffer, format: "pdf", mimeType: "application/pdf" };
  }
  if (originalMimeType === "image/svg+xml") {
    return { buffer, format: "svg", mimeType: "image/svg+xml" };
  }

  try {
    const optimized = await sharp(buffer)
      .rotate()
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    return { buffer: optimized, format: "webp", mimeType: "image/webp" };
  } catch (err: any) {
    console.warn("[r2Storage]: Sharp optimization skipped or failed, storing original buffer:", err.message);
    return {
      buffer,
      format: "jpg",
      mimeType: originalMimeType || "image/jpeg",
    };
  }
}

/**
 * Uploads an image buffer directly to Cloudflare R2 with automatic compression.
 * Compatible replacement for Cloudinary upload.
 *
 * @param fileBuffer Buffer of the uploaded file
 * @param folder Subfolder name (e.g. 'packages', 'villas', 'gallery', etc.)
 * @param originalMimeType Optional MIME type
 * @returns Promise resolving to { secure_url, public_id, bytes, format }
 */
export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string,
  originalMimeType?: string
): Promise<UploadResult> => {
  const { buffer, format, mimeType } = await compressImage(fileBuffer, originalMimeType);
  const randomId = crypto.randomBytes(12).toString("hex");
  const key = `villa-lemon/${folder}/${randomId}.${format}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await r2Client.send(command);

  const secure_url = `${publicBaseUrl}/${key}`;

  console.log(`[r2Storage]: Uploaded ${key} (${(buffer.length / 1024).toFixed(1)} KB)`);

  return {
    secure_url,
    public_id: key,
    bytes: buffer.length,
    format,
  };
};

/**
 * Deletes a resource from Cloudflare R2 using its key / public ID.
 *
 * @param publicId Object key (e.g. 'villa-lemon/packages/xyz.webp')
 */
export const deleteImage = async (publicId: string): Promise<any> => {
  try {
    // If a full URL was passed by mistake, extract the key
    const key = publicId.replace(/^https?:\/\/[^\/]+\//, "").replace(/^\/+/, "");
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const result = await r2Client.send(command);
    console.log(`[r2Storage]: Deleted object '${key}'`);
    return result;
  } catch (error) {
    console.error(`[r2Storage]: Delete error for '${publicId}':`, error);
    throw error;
  }
};
