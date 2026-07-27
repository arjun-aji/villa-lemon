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
    const galleryFiles = files?.gallery || [];
    const ogImageFile = files?.ogImage?.[0];

    // Upload images if provided
    let imageUrl = "";
    let imagePublicId = "";
    if (imageFile) {
      console.log("[cloudinary]: Uploading package cover image to Cloudinary...");
      const coverUpload = await uploadImage(imageFile.buffer, "packages");
      imageUrl = coverUpload.secure_url;
      imagePublicId = coverUpload.public_id;
    }

    let aboutImageUrl = "";
    let aboutImagePublicId = "";
    if (aboutImageFile) {
      console.log("[cloudinary]: Uploading package detail image to Cloudinary...");
      const aboutUpload = await uploadImage(aboutImageFile.buffer, "packages");
      aboutImageUrl = aboutUpload.secure_url;
      aboutImagePublicId = aboutUpload.public_id;
    }

    // Upload Gallery Images
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

    // Upload ogImage
    let ogImageUrl = "";
    let ogImagePublicId = "";
    if (ogImageFile) {
      console.log("[cloudinary]: Uploading SEO ogImage to Cloudinary...");
      const ogUpload = await uploadImage(ogImageFile.buffer, "seo");
      ogImageUrl = ogUpload.secure_url;
      ogImagePublicId = ogUpload.public_id;
    }

    const newItem = new PackageItem({
      packageCategory,
      title,
      slug,
      price: Number(price),
      pricePeriod,
      image: imageUrl,
      imagePublicId: imagePublicId,
      aboutImage: aboutImageUrl,
      aboutImagePublicId: aboutImagePublicId,
      duration,
      shortDescription,
      tagline,
      aboutText,
      itinerary,
      inclusions,
      exclusions,
      highlights,
      whyGuestsLoveUs,

      // General Info
      travelTime: parseField(req.body.travelTime),
      entryFee: parseField(req.body.entryFee),
      optionalCharges: parseField(req.body.optionalCharges),
      difficulty: parseField(req.body.difficulty),
      groupSize: parseField(req.body.groupSize),
      location: parseField(req.body.location),

      // Localized Content
      tourOverview: parseField(req.body.tourOverview),
      bestTime: parseField(req.body.bestTime),
      dressCode: parseField(req.body.dressCode),
      cta: parseField(req.body.cta),

      // Media
      gallery: galleryUrls,
      galleryPublicIds: galleryPublicIds,
      video: req.body.video || "",

      // Structural lists
      quickFacts: parseField(req.body.quickFacts),
      thingsToBring: parseField(req.body.thingsToBring),
      nearbyAttractions: parseField(req.body.nearbyAttractions),
      relatedPackages: parseField(req.body.relatedPackages),
      faqs: parseField(req.body.faqs),

      // SEO
      metaTitle: parseField(req.body.metaTitle),
      metaDescription: parseField(req.body.metaDescription),
      keywords: parseField(req.body.keywords),
      ogImage: ogImageUrl,
      ogImagePublicId: ogImagePublicId,
      canonicalUrl: req.body.canonicalUrl || "",

      // Booking Info
      cancellation: parseField(req.body.cancellation),
      refund: parseField(req.body.refund),
      pickup: parseField(req.body.pickup),
      drop: parseField(req.body.drop),
      notes: parseField(req.body.notes),
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
    if (req.body.video !== undefined) item.video = req.body.video;
    if (req.body.canonicalUrl !== undefined) item.canonicalUrl = req.body.canonicalUrl;

    // Parsed fields
    if (req.body.title) item.title = { ...item.title, ...parseField(req.body.title) };
    if (req.body.pricePeriod) item.pricePeriod = { ...item.pricePeriod, ...parseField(req.body.pricePeriod) };
    if (req.body.duration) item.duration = { ...item.duration, ...parseField(req.body.duration) };
    if (req.body.shortDescription) item.shortDescription = { ...item.shortDescription, ...parseField(req.body.shortDescription) };
    if (req.body.tagline) item.tagline = { ...item.tagline, ...parseField(req.body.tagline) };
    if (req.body.aboutText) item.aboutText = { ...item.aboutText, ...parseField(req.body.aboutText) };

    if (req.body.travelTime) item.travelTime = parseField(req.body.travelTime);
    if (req.body.entryFee) item.entryFee = parseField(req.body.entryFee);
    if (req.body.optionalCharges) item.optionalCharges = parseField(req.body.optionalCharges);
    if (req.body.difficulty) item.difficulty = parseField(req.body.difficulty);
    if (req.body.groupSize) item.groupSize = parseField(req.body.groupSize);
    if (req.body.location) item.location = parseField(req.body.location);

    if (req.body.tourOverview) item.tourOverview = parseField(req.body.tourOverview);
    if (req.body.bestTime) item.bestTime = parseField(req.body.bestTime);
    if (req.body.dressCode) item.dressCode = parseField(req.body.dressCode);
    if (req.body.cta) item.cta = parseField(req.body.cta);

    if (req.body.metaTitle) item.metaTitle = parseField(req.body.metaTitle);
    if (req.body.metaDescription) item.metaDescription = parseField(req.body.metaDescription);
    if (req.body.keywords) item.keywords = parseField(req.body.keywords);

    if (req.body.cancellation) item.cancellation = parseField(req.body.cancellation);
    if (req.body.refund) item.refund = parseField(req.body.refund);
    if (req.body.pickup) item.pickup = parseField(req.body.pickup);
    if (req.body.drop) item.drop = parseField(req.body.drop);
    if (req.body.notes) item.notes = parseField(req.body.notes);

    // Lists
    if (req.body.itinerary) item.itinerary = parseField(req.body.itinerary);
    if (req.body.inclusions) item.inclusions = parseField(req.body.inclusions);
    if (req.body.exclusions) item.exclusions = parseField(req.body.exclusions);
    if (req.body.highlights) item.highlights = parseField(req.body.highlights);
    if (req.body.whyGuestsLoveUs) item.whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs);
    if (req.body.quickFacts) item.quickFacts = parseField(req.body.quickFacts);
    if (req.body.thingsToBring) item.thingsToBring = parseField(req.body.thingsToBring);
    if (req.body.nearbyAttractions) item.nearbyAttractions = parseField(req.body.nearbyAttractions);
    if (req.body.relatedPackages) item.relatedPackages = parseField(req.body.relatedPackages);
    if (req.body.faqs) item.faqs = parseField(req.body.faqs);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const aboutImageFile = files?.aboutImage?.[0];
    const galleryFiles = files?.gallery || [];
    const ogImageFile = files?.ogImage?.[0];

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

    // Handle SEO ogImage replacement
    if (ogImageFile) {
      if (item.ogImagePublicId) {
        await deleteImage(item.ogImagePublicId).catch((err) => console.warn(`Cloudinary delete ogImage failed: ${err.message}`));
      }
      const ogUpload = await uploadImage(ogImageFile.buffer, "seo");
      item.ogImage = ogUpload.secure_url;
      item.ogImagePublicId = ogUpload.public_id;
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
    if (item.ogImagePublicId) {
      await deleteImage(item.ogImagePublicId).catch((err) => console.warn(`SEO OG image delete failed: ${err.message}`));
    }
    if (item.galleryPublicIds && item.galleryPublicIds.length > 0) {
      for (const pubId of item.galleryPublicIds) {
        if (pubId) {
          await deleteImage(pubId).catch((err) => console.warn(`Gallery image delete failed: ${err.message}`));
        }
      }
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
