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

    const accommodations = await Accommodation.find(filter).sort({ displayOrder: 1, createdAt: -1 });

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

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");

    if (imageFiles.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "An image file is required for creating an accommodation entry",
      });
    }

    // Upload images to Cloudinary folder 'villas'
    console.log("[cloudinary]: Uploading file buffers to Cloudinary...");
    const uploadPromises = imageFiles.map(file => uploadImage(file.buffer, "villas"));
    const uploadResults = await Promise.all(uploadPromises);

    const coverImages = uploadResults.map(res => res.secure_url);
    const coverImagePublicIds = uploadResults.map(res => res.public_id);

    const newAcc = new Accommodation({
      type,
      title,
      description,
      price,
      image: coverImages[0],
      imagePublicId: coverImagePublicIds[0],
      images: coverImages,
      imagePublicIds: coverImagePublicIds,
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
      template: req.body.template || "default",
      hideRate: req.body.hideRate === "true" || req.body.hideRate === true,
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
    if (req.body.template) acc.template = req.body.template;
    if (req.body.feature1Title) acc.feature1Title = { ...acc.feature1Title, ...parseField(req.body.feature1Title) };
    if (req.body.feature1Subtitle) acc.feature1Subtitle = { ...acc.feature1Subtitle, ...parseField(req.body.feature1Subtitle) };
    if (req.body.feature2Title) acc.feature2Title = { ...acc.feature2Title, ...parseField(req.body.feature2Title) };
    if (req.body.feature2Subtitle) acc.feature2Subtitle = { ...acc.feature2Subtitle, ...parseField(req.body.feature2Subtitle) };
    if (req.body.feature3Title) acc.feature3Title = { ...acc.feature3Title, ...parseField(req.body.feature3Title) };
    if (req.body.feature3Subtitle) acc.feature3Subtitle = { ...acc.feature3Subtitle, ...parseField(req.body.feature3Subtitle) };
    if (req.body.feature4Title) acc.feature4Title = { ...acc.feature4Title, ...parseField(req.body.feature4Title) };
    if (req.body.feature4Subtitle) acc.feature4Subtitle = { ...acc.feature4Subtitle, ...parseField(req.body.feature4Subtitle) };
    if (req.body.hideRate !== undefined) {
      acc.hideRate = req.body.hideRate === "true" || req.body.hideRate === true;
    }

    // Handle cover images — support existingImages to keep + new uploads to add
    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");

    // Parse which existing Cloudinary URLs to retain
    const existingImagesKept: string[] = req.body.existingImages ? parseField(req.body.existingImages) : null;

    if (existingImagesKept !== null || imageFiles.length > 0) {
      // Determine which old images were removed and delete those from Cloudinary
      const keptSet = new Set(existingImagesKept ?? ((acc.images && acc.images.length > 0) ? acc.images : (acc.image ? [acc.image] : [])));
      const currentImages: string[] = (acc.images && acc.images.length > 0) ? acc.images : (acc.image ? [acc.image] : []);
      const currentPublicIds: string[] = (acc.imagePublicIds && acc.imagePublicIds.length > 0) ? acc.imagePublicIds : (acc.imagePublicId ? [acc.imagePublicId] : []);

      const idsToDelete = currentPublicIds.filter((pid, idx) => {
        const url = currentImages[idx];
        return url && !keptSet.has(url);
      });
      if (idsToDelete.length > 0) {
        await Promise.all(idsToDelete.map(id => deleteImage(id).catch(() => {})));
      }

      // Keep existing images that weren't removed
      const keptUrls = currentImages.filter(url => keptSet.has(url));
      const keptPublicIds = currentPublicIds.filter((_, idx) => {
        const url = currentImages[idx];
        return url && keptSet.has(url);
      });

      // Upload new images
      let newUrls: string[] = [];
      let newPublicIds: string[] = [];
      if (imageFiles.length > 0) {
        console.log("[cloudinary]: Uploading new file buffers to Cloudinary...");
        const uploadResults = await Promise.all(imageFiles.map(file => uploadImage(file.buffer, "villas")));
        newUrls = uploadResults.map(r => r.secure_url);
        newPublicIds = uploadResults.map(r => r.public_id);
      }

      const allImages = [...keptUrls, ...newUrls];
      const allPublicIds = [...keptPublicIds, ...newPublicIds];

      acc.images = allImages;
      acc.imagePublicIds = allPublicIds;
      acc.image = allImages[0] || acc.image;
      acc.imagePublicId = allPublicIds[0] || acc.imagePublicId;
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

export const reorderAccommodations = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ status: "fail", message: "ids array is required" });
    }
    await Promise.all(
      ids.map((id: string, index: number) =>
        Accommodation.findByIdAndUpdate(id, { displayOrder: index })
      )
    );
    res.status(200).json({
      status: "success",
      message: "Accommodations reordered successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to reorder accommodations",
    });
  }
};
