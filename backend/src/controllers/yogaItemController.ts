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

    const items = await YogaItem.find(filter).sort({ displayOrder: 1, createdAt: -1 });

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
    const relatedYoga = parseField(req.body.relatedYoga) || [];

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");
    const aboutImageFile = files.find(f => f.fieldname === "aboutImage");

    if (imageFiles.length === 0 || !aboutImageFile) {
      return res.status(400).json({
        status: "fail",
        message: "Both cover image and about section image are required",
      });
    }

    // Upload to Cloudinary
    console.log("[cloudinary]: Uploading yoga images to Cloudinary...");
    const coverPromises = imageFiles.map(file => uploadImage(file.buffer, "yoga"));
    const coverUploads = await Promise.all(coverPromises);
    const coverImages = coverUploads.map(r => r.secure_url);
    const coverImagePublicIds = coverUploads.map(r => r.public_id);

    const aboutUpload = await uploadImage(aboutImageFile.buffer, "yoga");

    const newItem = new YogaItem({
      yogaType,
      title,
      slug,
      price: Number(price),
      pricePeriod,
      image: coverImages[0],
      imagePublicId: coverImagePublicIds[0],
      images: coverImages,
      imagePublicIds: coverImagePublicIds,
      aboutImage: aboutUpload.secure_url,
      aboutImagePublicId: aboutUpload.public_id,
      duration,
      shortDescription,
      tagline,
      aboutText,
      schedule,
      benefits,
      inclusions,
      relatedYoga,
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
    if (req.body.relatedYoga) item.relatedYoga = parseField(req.body.relatedYoga);

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");
    const aboutImageFile = files.find(f => f.fieldname === "aboutImage");

    // Handle Cover Image — support existingImages to keep + new uploads to add
    const existingImagesKept: string[] = req.body.existingImages ? parseField(req.body.existingImages) : null;

    if (existingImagesKept !== null || imageFiles.length > 0) {
      const keptSet = new Set(existingImagesKept ?? (item.images || []));
      const currentImages: string[] = item.images || (item.image ? [item.image] : []);
      const currentPublicIds: string[] = item.imagePublicIds || (item.imagePublicId ? [item.imagePublicId] : []);

      const idsToDelete = currentPublicIds.filter((pid, idx) => {
        const url = currentImages[idx];
        return url && !keptSet.has(url);
      });
      if (idsToDelete.length > 0) {
        await Promise.all(idsToDelete.map(id => deleteImage(id).catch(() => {})));
      }

      const keptUrls = currentImages.filter(url => keptSet.has(url));
      const keptPublicIds = currentPublicIds.filter((_, idx) => {
        const url = currentImages[idx];
        return url && keptSet.has(url);
      });

      let newUrls: string[] = [];
      let newPublicIds: string[] = [];
      if (imageFiles.length > 0) {
        const coverPromises = imageFiles.map(file => uploadImage(file.buffer, "yoga"));
        const coverUploads = await Promise.all(coverPromises);
        newUrls = coverUploads.map(r => r.secure_url);
        newPublicIds = coverUploads.map(r => r.public_id);
      }

      const allImages = [...keptUrls, ...newUrls];
      const allPublicIds = [...keptPublicIds, ...newPublicIds];

      item.images = allImages;
      item.imagePublicIds = allPublicIds;
      item.image = allImages[0] || item.image;
      item.imagePublicId = allPublicIds[0] || item.imagePublicId;
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

export const reorderYogaItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ status: "fail", message: "ids array is required" });
    }
    await Promise.all(
      ids.map((id: string, index: number) =>
        YogaItem.findByIdAndUpdate(id, { displayOrder: index })
      )
    );
    res.status(200).json({
      status: "success",
      message: "Yoga items reordered successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to reorder yoga items",
    });
  }
};
