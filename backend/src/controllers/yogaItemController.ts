import { Request, Response } from "express";
import { YogaItem } from "../models/YogaItem";
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

export const getAllYogaItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const filter: any = {};
    if (req.query.type) {
      filter.yogaType = req.query.type;
    }
    if (req.query.slug) {
      filter.slug = req.query.slug;
    }

    const items = await YogaItem.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: items.length,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch yoga items",
    });
  }
};

export const getYogaItemBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const item = await YogaItem.findOne({ slug });

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Yoga item not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch yoga item",
    });
  }
};

export const createYogaItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { yogaType, slug, price } = req.body;

    const title = parseField(req.body.title);
    const pricePeriod = parseField(req.body.pricePeriod);
    const duration = parseField(req.body.duration);
    const shortDescription = parseField(req.body.shortDescription);
    const tagline = parseField(req.body.tagline);
    const aboutText = parseField(req.body.aboutText);

    // Arrays/Objects
    const schedule = parseField(req.body.schedule);
    const benefits = parseField(req.body.benefits);
    const inclusions = parseField(req.body.inclusions);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const aboutImageFile = files?.aboutImage?.[0];

    if (!imageFile || !aboutImageFile) {
      return res.status(400).json({
        status: "fail",
        message: "Both cover image and about section image are required",
      });
    }

    // Upload to Cloudinary
    console.log("[cloudinary]: Uploading yoga images to Cloudinary...");
    const coverUpload = await uploadImage(imageFile.buffer, "yoga");
    const aboutUpload = await uploadImage(aboutImageFile.buffer, "yoga");

    const newItem = new YogaItem({
      yogaType,
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
      schedule,
      benefits,
      inclusions,
    });

    await newItem.save();

    res.status(201).json({
      status: "success",
      data: newItem,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create yoga item",
    });
  }
};

export const updateYogaItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const item = await YogaItem.findById(id);

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Yoga item not found",
      });
    }

    // Simple fields
    if (req.body.yogaType) item.yogaType = req.body.yogaType;
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
    if (req.body.schedule) item.schedule = parseField(req.body.schedule);
    if (req.body.benefits) item.benefits = parseField(req.body.benefits);
    if (req.body.inclusions) item.inclusions = parseField(req.body.inclusions);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const aboutImageFile = files?.aboutImage?.[0];

    // Handle Cover Image replacement
    if (imageFile) {
      if (item.imagePublicId) {
        await deleteImage(item.imagePublicId).catch((err) => console.warn(`Cloudinary delete cover failed: ${err.message}`));
      }
      const coverUpload = await uploadImage(imageFile.buffer, "yoga");
      item.image = coverUpload.secure_url;
      item.imagePublicId = coverUpload.public_id;
    }

    // Handle About Image replacement
    if (aboutImageFile) {
      if (item.aboutImagePublicId) {
        await deleteImage(item.aboutImagePublicId).catch((err) => console.warn(`Cloudinary delete about failed: ${err.message}`));
      }
      const aboutUpload = await uploadImage(aboutImageFile.buffer, "yoga");
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
      message: error.message || "Failed to update yoga item",
    });
  }
};

export const deleteYogaItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const item = await YogaItem.findById(id);

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Yoga item not found",
      });
    }

    // Delete from Cloudinary
    if (item.imagePublicId) {
      await deleteImage(item.imagePublicId).catch((err) => console.warn(`Cover delete failed: ${err.message}`));
    }
    if (item.aboutImagePublicId) {
      await deleteImage(item.aboutImagePublicId).catch((err) => console.warn(`About image delete failed: ${err.message}`));
    }

    await YogaItem.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Yoga item deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to delete yoga item",
    });
  }
};
