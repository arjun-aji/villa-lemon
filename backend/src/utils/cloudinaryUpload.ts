import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

/**
 * Uploads a file buffer directly to a specified folder in Cloudinary.
 * Uses upload_stream to write the buffer from memory, avoiding temp files on disk.
 * 
 * @param fileBuffer Buffer of the uploaded file
 * @param folder Subfolder name under 'villa-lemon/' (e.g. 'villas', 'yoga', etc.)
 * @returns Promise resolving to the Cloudinary Upload API response
 */
export const uploadImage = (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `villa-lemon/${folder}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error(`[cloudinary]: Upload error in folder 'villa-lemon/${folder}':`, error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload returned empty response"));
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes a resource from Cloudinary using its public ID.
 * 
 * @param publicId Public ID of the resource to delete
 * @returns Promise resolving to the deletion result
 */
export const deleteImage = (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error(`[cloudinary]: Delete error for publicId '${publicId}':`, error);
        return reject(error);
      }
      resolve(result);
    });
  });
};
