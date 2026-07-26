import { Request, Response } from "express";
import { PackageItem } from "../models/PackageItem";
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

export const getAllPackageItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const filter: any = {};
    if (req.query.category) {
      filter.packageCategory = req.query.category;
    }
    if (req.query.slug) {
      filter.slug = req.query.slug;
    }

    const items = await PackageItem.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: items.length,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch package items",
    });
  }
};

export const getPackageItemBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const item = await PackageItem.findOne({ slug });

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Package item not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch package item",
    });
  }
};

export const createPackageItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { packageCategory, slug, price } = req.body;

    const title = parseField(req.body.title);
    const pricePeriod = parseField(req.body.pricePeriod);
    const duration = parseField(req.body.duration);
    const shortDescription = parseField(req.body.shortDescription);
    const tagline = parseField(req.body.tagline);
    const aboutText = parseField(req.body.aboutText);

    // Arrays/Objects
    const itinerary = parseField(req.body.itinerary);
    const inclusions = parseField(req.body.inclusions);
    const exclusions = parseField(req.body.exclusions);
    const highlights = parseField(req.body.highlights);
    const whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const aboutImageFile = files?.aboutImage?.[0];

    if (!imageFile || !aboutImageFile) {
      return res.status(400).json({
        status: "fail",
        message: "Both cover image and details section image are required",
      });
    }

    // Upload images
    console.log("[cloudinary]: Uploading package images to Cloudinary...");
    const coverUpload = await uploadImage(imageFile.buffer, "packages");
    const aboutUpload = await uploadImage(aboutImageFile.buffer, "packages");

    const newItem = new PackageItem({
      packageCategory,
      title,
      slug,
      price: Number(price),
      pricePeriod,
      image: coverUpload.secure_url,
      imagePublicId: coverUpload.public_id,
      aboutImage: aboutUpload.secure_url,
      aboutImagePublicId: aboutUpload.public_id,
      duration,
      shortDescription,
      tagline,
      aboutText,
      itinerary,
      inclusions,
      exclusions,
      highlights,
      whyGuestsLoveUs,
    });

    await newItem.save();

    res.status(201).json({
      status: "success",
      data: newItem,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create package item",
    });
  }
};

export const updatePackageItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const item = await PackageItem.findById(id);

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Package item not found",
      });
    }

    // Simple fields
    if (req.body.packageCategory) item.packageCategory = req.body.packageCategory;
    if (req.body.slug) item.slug = req.body.slug;
    if (req.body.price) item.price = Number(req.body.price);

    // Parsed fields
    if (req.body.title) item.title = { ...item.title, ...parseField(req.body.title) };
    if (req.body.pricePeriod) item.pricePeriod = { ...item.pricePeriod, ...parseField(req.body.pricePeriod) };
    if (req.body.duration) item.duration = { ...item.duration, ...parseField(req.body.duration) };
    if (req.body.shortDescription) item.shortDescription = { ...item.shortDescription, ...parseField(req.body.shortDescription) };
    if (req.body.tagline) item.tagline = { ...item.tagline, ...parseField(req.body.tagline) };
    if (req.body.aboutText) item.aboutText = { ...item.aboutText, ...parseField(req.body.aboutText) };

    // Lists
    if (req.body.itinerary) item.itinerary = parseField(req.body.itinerary);
    if (req.body.inclusions) item.inclusions = parseField(req.body.inclusions);
    if (req.body.exclusions) item.exclusions = parseField(req.body.exclusions);
    if (req.body.highlights) item.highlights = parseField(req.body.highlights);
    if (req.body.whyGuestsLoveUs) item.whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const aboutImageFile = files?.aboutImage?.[0];

    // Handle Cover Image replacement
    if (imageFile) {
      if (item.imagePublicId) {
        await deleteImage(item.imagePublicId).catch((err) => console.warn(`Cloudinary delete cover failed: ${err.message}`));
      }
      const coverUpload = await uploadImage(imageFile.buffer, "packages");
      item.image = coverUpload.secure_url;
      item.imagePublicId = coverUpload.public_id;
    }

    // Handle About Image replacement
    if (aboutImageFile) {
      if (item.aboutImagePublicId) {
        await deleteImage(item.aboutImagePublicId).catch((err) => console.warn(`Cloudinary delete about failed: ${err.message}`));
      }
      const aboutUpload = await uploadImage(aboutImageFile.buffer, "packages");
      item.aboutImage = aboutUpload.secure_url;
      item.aboutImagePublicId = aboutUpload.public_id;
    }

    await item.save();

    res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update package item",
    });
  }
};

export const deletePackageItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const item = await PackageItem.findById(id);

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Package item not found",
      });
    }

    // Delete from Cloudinary
    if (item.imagePublicId) {
      await deleteImage(item.imagePublicId).catch((err) => console.warn(`Cover delete failed: ${err.message}`));
    }
    if (item.aboutImagePublicId) {
      await deleteImage(item.aboutImagePublicId).catch((err) => console.warn(`About image delete failed: ${err.message}`));
    }

    await PackageItem.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Package item deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to delete package item",
    });
  }
};
