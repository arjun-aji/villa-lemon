import { Request, Response } from "express";
import { AccommodationItem } from "../models/AccommodationItem";
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

export const getAllAccommodationItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const filter: any = {};
    if (req.query.type) {
      filter.accommodationType = req.query.type;
    }
    if (req.query.slug) {
      filter.slug = req.query.slug;
    }

    const items = await AccommodationItem.find(filter).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: items.length,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch accommodation items",
    });
  }
};

export const getAccommodationItemBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const item = await AccommodationItem.findOne({ slug });

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Accommodation item not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch accommodation item",
    });
  }
};

export const createAccommodationItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { accommodationType, slug, price, bedrooms, bathrooms, guests, checkInTime, checkOutTime, mapLink } = req.body;

    const title = parseField(req.body.title);
    const pricePeriod = parseField(req.body.pricePeriod);
    const location = parseField(req.body.location);
    const shortDescription = parseField(req.body.shortDescription);
    const tagline = parseField(req.body.tagline);
    const aboutText1 = parseField(req.body.aboutText1);
    const aboutText2 = parseField(req.body.aboutText2);
    const perfectLocationText = parseField(req.body.perfectLocationText);
    const groupAccommodationText = parseField(req.body.groupAccommodationText);

    // Arrays/Objects
    const highlights = parseField(req.body.highlights);
    const whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs);
    const distances = parseField(req.body.distances);
    const roomAmenities = parseField(req.body.roomAmenities);
    const idealFor = parseField(req.body.idealFor);
    const checkInOutRules = parseField(req.body.checkInOutRules);
    const additionalServices = parseField(req.body.additionalServices);
    const relatedAccommodations = parseField(req.body.relatedAccommodations) || [];

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");
    const aboutImageFile = files.find(f => f.fieldname === "aboutImage");
    const galleryFiles = files.filter(f => f.fieldname === "gallery");

    if (imageFiles.length === 0 || !aboutImageFile) {
      return res.status(400).json({
        status: "fail",
        message: "Both cover image and about section image are required",
      });
    }

    // Upload to Cloudinary
    console.log("[cloudinary]: Uploading cover image and about image to Cloudinary...");
    const coverPromises = imageFiles.map(file => uploadImage(file.buffer, "villas"));
    const coverUploads = await Promise.all(coverPromises);
    const coverImages = coverUploads.map(r => r.secure_url);
    const coverImagePublicIds = coverUploads.map(r => r.public_id);

    const aboutUpload = await uploadImage(aboutImageFile.buffer, "about");

    const galleryUrls: string[] = [];
    const galleryPublicIds: string[] = [];
    if (galleryFiles.length > 0) {
      console.log(`[cloudinary]: Uploading ${galleryFiles.length} gallery images to Cloudinary...`);
      const uploads = await Promise.all(
        galleryFiles.map((file) => uploadImage(file.buffer, "gallery"))
      );
      uploads.forEach((up) => {
        galleryUrls.push(up.secure_url);
        galleryPublicIds.push(up.public_id);
      });
    }

    const newItem = new AccommodationItem({
      accommodationType,
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
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      guests: Number(guests),
      location,
      shortDescription,
      tagline,
      aboutText1,
      aboutText2,
      highlights,
      whyGuestsLoveUs,
      distances,
      perfectLocationText,
      roomAmenities,
      idealFor,
      groupAccommodationText,
      checkInTime,
      checkOutTime,
      checkInOutRules,
      additionalServices,
      mapLink: mapLink || "",
      gallery: galleryUrls,
      galleryPublicIds: galleryPublicIds,
      relatedAccommodations,
    });

    await newItem.save();

    res.status(201).json({
      status: "success",
      data: newItem,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create accommodation item",
    });
  }
};

export const updateAccommodationItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const item = await AccommodationItem.findById(id);

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Accommodation item not found",
      });
    }

    // Simple fields
    if (req.body.accommodationType) item.accommodationType = req.body.accommodationType;
    if (req.body.slug) item.slug = req.body.slug;
    if (req.body.price) item.price = Number(req.body.price);
    if (req.body.bedrooms) item.bedrooms = Number(req.body.bedrooms);
    if (req.body.bathrooms) item.bathrooms = Number(req.body.bathrooms);
    if (req.body.guests) item.guests = Number(req.body.guests);
    if (req.body.checkInTime) item.checkInTime = req.body.checkInTime;
    if (req.body.checkOutTime) item.checkOutTime = req.body.checkOutTime;
    if (req.body.mapLink !== undefined) item.mapLink = req.body.mapLink;

    // Parsed fields
    if (req.body.title) item.title = { ...item.title, ...parseField(req.body.title) };
    if (req.body.pricePeriod) item.pricePeriod = { ...item.pricePeriod, ...parseField(req.body.pricePeriod) };
    if (req.body.location) item.location = { ...item.location, ...parseField(req.body.location) };
    if (req.body.shortDescription) item.shortDescription = { ...item.shortDescription, ...parseField(req.body.shortDescription) };
    if (req.body.tagline) item.tagline = { ...item.tagline, ...parseField(req.body.tagline) };
    if (req.body.aboutText1) item.aboutText1 = { ...item.aboutText1, ...parseField(req.body.aboutText1) };
    if (req.body.aboutText2) item.aboutText2 = { ...item.aboutText2, ...parseField(req.body.aboutText2) };
    if (req.body.perfectLocationText) item.perfectLocationText = { ...item.perfectLocationText, ...parseField(req.body.perfectLocationText) };
    if (req.body.groupAccommodationText) item.groupAccommodationText = { ...item.groupAccommodationText, ...parseField(req.body.groupAccommodationText) };

    // Lists
    if (req.body.highlights) item.highlights = parseField(req.body.highlights);
    if (req.body.whyGuestsLoveUs) item.whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs);
    if (req.body.distances) item.distances = parseField(req.body.distances);
    if (req.body.roomAmenities) item.roomAmenities = parseField(req.body.roomAmenities);
    if (req.body.idealFor) item.idealFor = parseField(req.body.idealFor);
    if (req.body.checkInOutRules) item.checkInOutRules = parseField(req.body.checkInOutRules);
    if (req.body.additionalServices) item.additionalServices = parseField(req.body.additionalServices);
    if (req.body.relatedAccommodations) item.relatedAccommodations = parseField(req.body.relatedAccommodations);

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");
    const aboutImageFile = files.find(f => f.fieldname === "aboutImage");
    const galleryFiles = files.filter(f => f.fieldname === "gallery");

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
        const coverPromises = imageFiles.map(file => uploadImage(file.buffer, "villas"));
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
      const aboutUpload = await uploadImage(aboutImageFile.buffer, "about");
      item.aboutImage = aboutUpload.secure_url;
      item.aboutImagePublicId = aboutUpload.public_id;
    }

    // Handle Gallery sync and new uploads
    let gallery = item.gallery || [];
    let galleryPublicIds = item.galleryPublicIds || [];

    if (req.body.existingGallery) {
      const existing = parseField(req.body.existingGallery);
      const keptIndices = existing.map((url: string) => gallery.indexOf(url)).filter((idx: number) => idx !== -1);
      
      const toDelete = galleryPublicIds.filter((_, idx) => !keptIndices.includes(idx));
      for (const pubId of toDelete) {
        if (pubId) {
          await deleteImage(pubId).catch((err) => console.warn(`Cloudinary delete gallery image failed: ${err.message}`));
        }
      }

      gallery = existing;
      galleryPublicIds = galleryPublicIds.filter((_, idx) => keptIndices.includes(idx));
    }

    if (galleryFiles.length > 0) {
      console.log(`[cloudinary]: Uploading ${galleryFiles.length} new gallery images to Cloudinary...`);
      const uploads = await Promise.all(
        galleryFiles.map((file) => uploadImage(file.buffer, "gallery"))
      );
      uploads.forEach((up) => {
        gallery.push(up.secure_url);
        galleryPublicIds.push(up.public_id);
      });
    }

    item.gallery = gallery;
    item.galleryPublicIds = galleryPublicIds;

    await item.save();

    res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update accommodation item",
    });
  }
};

export const deleteAccommodationItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const item = await AccommodationItem.findById(id);

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Accommodation item not found",
      });
    }

    // Delete both resources from Cloudinary
    if (item.imagePublicId) {
      await deleteImage(item.imagePublicId).catch((err) => console.warn(`Cover delete failed: ${err.message}`));
    }
    if (item.aboutImagePublicId) {
      await deleteImage(item.aboutImagePublicId).catch((err) => console.warn(`About image delete failed: ${err.message}`));
    }

    await AccommodationItem.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Accommodation item deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to delete accommodation item",
    });
  }
};

export const reorderAccommodationItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ status: "fail", message: "ids array is required" });
    }
    await Promise.all(
      ids.map((id: string, index: number) =>
        AccommodationItem.findByIdAndUpdate(id, { displayOrder: index })
      )
    );
    res.status(200).json({
      status: "success",
      message: "Accommodation items reordered successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to reorder accommodation items",
    });
  }
};
