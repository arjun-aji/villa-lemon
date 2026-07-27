import { Request, Response } from "express";
import { Accommodation } from "../models/Accommodation";
import { uploadImage, deleteImage } from "../utils/cloudinaryUpload";

const parseField = (field: any) => {
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return field;
    }
  }
  return field;
};

export const getAllAccommodations = async (req: Request, res: Response): Promise<any> => {
  try {
    const filter: any = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const accommodations = await Accommodation.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: accommodations.length,
      data: accommodations,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch accommodations",
    });
  }
};

export const createAccommodation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type, href } = req.body;
    
    // Parse localized fields
    const title = parseField(req.body.title);
    const description = parseField(req.body.description);
    const price = parseField(req.body.price);
    const explore = parseField(req.body.explore);
    const feature1Title = parseField(req.body.feature1Title);
    const feature1Subtitle = parseField(req.body.feature1Subtitle);
    const feature2Title = parseField(req.body.feature2Title);
    const feature2Subtitle = parseField(req.body.feature2Subtitle);
    const feature3Title = parseField(req.body.feature3Title);
    const feature3Subtitle = parseField(req.body.feature3Subtitle);
    const feature4Title = parseField(req.body.feature4Title);
    const feature4Subtitle = parseField(req.body.feature4Subtitle);

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "An image file is required for creating an accommodation entry",
      });
    }

    // Upload image to Cloudinary folder 'villas'
    console.log("[cloudinary]: Uploading file buffer to Cloudinary...");
    const uploadResult = await uploadImage(req.file.buffer, "villas");

    const newAcc = new Accommodation({
      type,
      title,
      description,
      price,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      explore,
      href: href || "#contact",
      feature1Title,
      feature1Subtitle,
      feature2Title,
      feature2Subtitle,
      feature3Title,
      feature3Subtitle,
      feature4Title,
      feature4Subtitle,
    });

    await newAcc.save();

    res.status(201).json({
      status: "success",
      data: newAcc,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create accommodation entry",
    });
  }
};

export const updateAccommodation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const acc = await Accommodation.findById(id);

    if (!acc) {
      return res.status(404).json({
        status: "fail",
        message: "Accommodation entry not found",
      });
    }

    // Parse inputs
    if (req.body.type) acc.type = req.body.type;
    if (req.body.href) acc.href = req.body.href;
    if (req.body.title) acc.title = { ...acc.title, ...parseField(req.body.title) };
    if (req.body.description) acc.description = { ...acc.description, ...parseField(req.body.description) };
    if (req.body.price) acc.price = { ...acc.price, ...parseField(req.body.price) };
    if (req.body.explore) acc.explore = { ...acc.explore, ...parseField(req.body.explore) };
    if (req.body.feature1Title) acc.feature1Title = { ...acc.feature1Title, ...parseField(req.body.feature1Title) };
    if (req.body.feature1Subtitle) acc.feature1Subtitle = { ...acc.feature1Subtitle, ...parseField(req.body.feature1Subtitle) };
    if (req.body.feature2Title) acc.feature2Title = { ...acc.feature2Title, ...parseField(req.body.feature2Title) };
    if (req.body.feature2Subtitle) acc.feature2Subtitle = { ...acc.feature2Subtitle, ...parseField(req.body.feature2Subtitle) };
    if (req.body.feature3Title) acc.feature3Title = { ...acc.feature3Title, ...parseField(req.body.feature3Title) };
    if (req.body.feature3Subtitle) acc.feature3Subtitle = { ...acc.feature3Subtitle, ...parseField(req.body.feature3Subtitle) };
    if (req.body.feature4Title) acc.feature4Title = { ...acc.feature4Title, ...parseField(req.body.feature4Title) };
    if (req.body.feature4Subtitle) acc.feature4Subtitle = { ...acc.feature4Subtitle, ...parseField(req.body.feature4Subtitle) };

    // If new image file is provided
    if (req.file) {
      // 1. Delete old image from Cloudinary
      if (acc.imagePublicId) {
        console.log(`[cloudinary]: Deleting old resource publicId: ${acc.imagePublicId}`);
        await deleteImage(acc.imagePublicId).catch(err => {
          console.warn(`[cloudinary]: Warning - Old image delete failed: ${err.message}`);
        });
      }

      // 2. Upload new image
      console.log("[cloudinary]: Uploading new file buffer to Cloudinary...");
      const uploadResult = await uploadImage(req.file.buffer, "villas");
      acc.image = uploadResult.secure_url;
      acc.imagePublicId = uploadResult.public_id;
    }

    await acc.save();

    res.status(200).json({
      status: "success",
      data: acc,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update accommodation entry",
    });
  }
};

export const deleteAccommodation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const acc = await Accommodation.findById(id);

    if (!acc) {
      return res.status(404).json({
        status: "fail",
        message: "Accommodation entry not found",
      });
    }

    // Delete image from Cloudinary
    if (acc.imagePublicId) {
      console.log(`[cloudinary]: Deleting image: ${acc.imagePublicId}`);
      await deleteImage(acc.imagePublicId).catch(err => {
        console.warn(`[cloudinary]: Warning - Image delete failed: ${err.message}`);
      });
    }

    await Accommodation.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Accommodation entry deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to delete accommodation entry",
    });
  }
};
