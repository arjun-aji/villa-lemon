import { Request, Response } from "express";
import GalleryItem from "../models/GalleryItem";
import { uploadImage, deleteImage } from "../utils/cloudinaryUpload";

// Helper to parse localized text JSON
const parseField = (field: any) => {
  if (!field) return { en: "", de: "", fr: "", ru: "" };
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return { en: field, de: "", fr: "", ru: "" };
    }
  }
  return field;
};

// GET /api/gallery
export const getGalleryItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const items = await GalleryItem.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    
    res.status(200).json({
      status: "success",
      count: items.length,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch gallery items",
    });
  }
};

// POST /api/gallery
export const createGalleryItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category, displayOrder } = req.body;
    const caption = parseField(req.body.caption);
    
    if (!category) {
      return res.status(450).json({
        status: "fail",
        message: "Category is required",
      });
    }

    if (!req.file) {
      return res.status(450).json({
        status: "fail",
        message: "Image file is required",
      });
    }

    console.log("[cloudinary]: Uploading gallery image to Cloudinary...");
    const uploadResult = await uploadImage(req.file.buffer, "gallery");
    
    const newItem = new GalleryItem({
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      category,
      caption,
      displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
    });

    await newItem.save();
    
    res.status(201).json({
      status: "success",
      data: newItem,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create gallery item",
    });
  }
};

// DELETE /api/gallery/:id
export const deleteGalleryItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);
    
    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Gallery item not found",
      });
    }

    // Delete image from Cloudinary if publicId exists
    if (item.imagePublicId) {
      console.log(`[cloudinary]: Deleting gallery image ${item.imagePublicId} from Cloudinary...`);
      await deleteImage(item.imagePublicId);
    }

    await GalleryItem.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Gallery item deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to delete gallery item",
    });
  }
};
