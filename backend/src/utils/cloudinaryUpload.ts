/**
 * Storage adapter module.
 * Routes upload and delete requests to Cloudflare R2 with automatic Sharp image compression,
 * preserving existing function signatures and interfaces across all backend controllers.
 */
export { uploadImage, deleteImage, UploadResult } from "./r2Upload";
export { default } from "../config/cloudinary";
