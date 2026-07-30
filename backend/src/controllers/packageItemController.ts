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

    const items = await PackageItem.find(filter).sort({ displayOrder: 1, createdAt: -1 });

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
    const itineraryEvening = parseField(req.body.itineraryEvening);
    const inclusions = parseField(req.body.inclusions);
    const exclusions = parseField(req.body.exclusions);
    const highlights = parseField(req.body.highlights);
    const whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs);

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");
    const aboutImageFiles = files.filter(f => f.fieldname === "aboutImage");
    const galleryFiles = files.filter(f => f.fieldname === "gallery");
    const ogImageFile = files.find(f => f.fieldname === "ogImage");

    // Upload images if provided
    let imageUrl = "";
    let imagePublicId = "";
    let coverImages: string[] = [];
    let coverImagePublicIds: string[] = [];

    if (imageFiles.length > 0) {
      console.log("[cloudinary]: Uploading package cover images to Cloudinary...");
      const coverPromises = imageFiles.map(file => uploadImage(file.buffer, "packages"));
      const coverUploads = await Promise.all(coverPromises);
      coverImages = coverUploads.map(r => r.secure_url);
      coverImagePublicIds = coverUploads.map(r => r.public_id);
      imageUrl = coverImages[0];
      imagePublicId = coverImagePublicIds[0];
    }

    let aboutImages: string[] = [];
    let aboutImagePublicIds: string[] = [];
    if (aboutImageFiles.length > 0) {
      console.log("[cloudinary]: Uploading package detail images to Cloudinary...");
      const aboutUploads = await Promise.all(
        aboutImageFiles.map(file => uploadImage(file.buffer, "packages"))
      );
      aboutImages = aboutUploads.map(r => r.secure_url);
      aboutImagePublicIds = aboutUploads.map(r => r.public_id);
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
      images: coverImages,
      imagePublicIds: coverImagePublicIds,
      aboutImage: aboutImages[0] || "",
      aboutImagePublicId: aboutImagePublicIds[0] || "",
      aboutImages: aboutImages,
      aboutImagePublicIds: aboutImagePublicIds,
      duration,
      shortDescription,
      tagline,
      aboutText,
      itinerary,
      itineraryEvening,
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
    if (req.body.itineraryEvening) item.itineraryEvening = parseField(req.body.itineraryEvening);
    if (req.body.inclusions) item.inclusions = parseField(req.body.inclusions);
    if (req.body.exclusions) item.exclusions = parseField(req.body.exclusions);
    if (req.body.highlights) item.highlights = parseField(req.body.highlights);
    if (req.body.whyGuestsLoveUs) item.whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs);
    if (req.body.quickFacts) item.quickFacts = parseField(req.body.quickFacts);
    if (req.body.thingsToBring) item.thingsToBring = parseField(req.body.thingsToBring);
    if (req.body.nearbyAttractions) item.nearbyAttractions = parseField(req.body.nearbyAttractions);
    if (req.body.relatedPackages) item.relatedPackages = parseField(req.body.relatedPackages);
    if (req.body.faqs) item.faqs = parseField(req.body.faqs);

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");
    const aboutImageFiles = files.filter(f => f.fieldname === "aboutImage");
    const galleryFiles = files.filter(f => f.fieldname === "gallery");
    const ogImageFile = files.find(f => f.fieldname === "ogImage");

    // Handle Cover Image — support existingImages to keep + new uploads to add
    const existingImagesKept: string[] = req.body.existingImages ? parseField(req.body.existingImages) : null;

    if (existingImagesKept !== null || imageFiles.length > 0) {
      const keptSet = new Set(existingImagesKept ?? ((item.images && item.images.length > 0) ? item.images : (item.image ? [item.image] : [])));
      const currentImages: string[] = (item.images && item.images.length > 0) ? item.images : (item.image ? [item.image] : []);
      const currentPublicIds: string[] = (item.imagePublicIds && item.imagePublicIds.length > 0) ? item.imagePublicIds : (item.imagePublicId ? [item.imagePublicId] : []);

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
        const coverPromises = imageFiles.map(file => uploadImage(file.buffer, "packages"));
        const coverUploads = await Promise.all(coverPromises);
        newUrls = coverUploads.map(r => r.secure_url);
        newPublicIds = coverUploads.map(r => r.public_id);
      }

      const allImages = [...keptUrls, ...newUrls];
      const allPublicIds = [...keptPublicIds, ...newPublicIds];

      item.images = allImages;
      item.imagePublicIds = allPublicIds;
      item.image = allImages[0] || "";
      item.imagePublicId = allPublicIds[0] || "";
    }

    // Handle About Image — support existingAboutImages to keep + new uploads to add
    const existingAboutImagesKept: string[] = req.body.existingAboutImages ? parseField(req.body.existingAboutImages) : null;

    if (existingAboutImagesKept !== null || aboutImageFiles.length > 0) {
      const keptSet = new Set(existingAboutImagesKept ?? ((item.aboutImages && item.aboutImages.length > 0) ? item.aboutImages : (item.aboutImage ? [item.aboutImage] : [])));
      const currentImages: string[] = (item.aboutImages && item.aboutImages.length > 0) ? item.aboutImages : (item.aboutImage ? [item.aboutImage] : []);
      const currentPublicIds: string[] = (item.aboutImagePublicIds && item.aboutImagePublicIds.length > 0) ? item.aboutImagePublicIds : (item.aboutImagePublicId ? [item.aboutImagePublicId] : []);

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
      if (aboutImageFiles.length > 0) {
        const aboutPromises = aboutImageFiles.map(file => uploadImage(file.buffer, "packages"));
        const aboutUploads = await Promise.all(aboutPromises);
        newUrls = aboutUploads.map(r => r.secure_url);
        newPublicIds = aboutUploads.map(r => r.public_id);
      }

      const allAboutImages = [...keptUrls, ...newUrls];
      const allAboutPublicIds = [...keptPublicIds, ...newPublicIds];

      item.aboutImages = allAboutImages;
      item.aboutImagePublicIds = allAboutPublicIds;
      item.aboutImage = allAboutImages[0] || "";
      item.aboutImagePublicId = allAboutPublicIds[0] || "";
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
    if (item.imagePublicIds && item.imagePublicIds.length > 0) {
      await Promise.all(item.imagePublicIds.map(pid => deleteImage(pid).catch(() => {})));
    } else if (item.imagePublicId) {
      await deleteImage(item.imagePublicId).catch(() => {});
    }

    if (item.aboutImagePublicIds && item.aboutImagePublicIds.length > 0) {
      await Promise.all(item.aboutImagePublicIds.map(pid => deleteImage(pid).catch(() => {})));
    } else if (item.aboutImagePublicId) {
      await deleteImage(item.aboutImagePublicId).catch(() => {});
    }

    if (item.ogImagePublicId) {
      await deleteImage(item.ogImagePublicId).catch(() => {});
    }

    if (item.galleryPublicIds && item.galleryPublicIds.length > 0) {
      await Promise.all(item.galleryPublicIds.map(pid => deleteImage(pid).catch(() => {})));
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

export const reorderPackageItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ status: "fail", message: "ids array is required" });
    }
    await Promise.all(
      ids.map((id: string, index: number) =>
        PackageItem.findByIdAndUpdate(id, { displayOrder: index })
      )
    );
    res.status(200).json({
      status: "success",
      message: "Package items reordered successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to reorder package items",
    });
  }
};
