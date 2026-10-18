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

const parseLocalizedOpt = (val: any) => {
  if (!val || val === "undefined") return { en: "", de: "", fr: "", ru: "" };
  const parsed = parseField(val);
  if (parsed && typeof parsed === "object") {
    return {
      en: typeof parsed.en === "string" ? parsed.en : "",
      de: typeof parsed.de === "string" ? parsed.de : "",
      fr: typeof parsed.fr === "string" ? parsed.fr : "",
      ru: typeof parsed.ru === "string" ? parsed.ru : "",
    };
  }
  return { en: "", de: "", fr: "", ru: "" };
};

const mergeLocalized = (existing: any, incoming: any) => {
  if (incoming === undefined || incoming === "undefined") return existing;
  const parsed = parseField(incoming);
  if (!parsed || typeof parsed !== "object") return existing;
  const base = existing && typeof existing.toObject === "function" ? existing.toObject() : existing || {};
  return {
    en: typeof parsed.en === "string" ? parsed.en : (base.en || ""),
    de: typeof parsed.de === "string" ? parsed.de : (base.de || ""),
    fr: typeof parsed.fr === "string" ? parsed.fr : (base.fr || ""),
    ru: typeof parsed.ru === "string" ? parsed.ru : (base.ru || ""),
  };
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
    const cleanSlug = typeof req.body.slug === "string" ? req.body.slug.trim() : "";

    const title = parseField(req.body.title);
    const shortDescription = parseField(req.body.shortDescription);

    if (!title || !title.en || !title.en.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Package Name (title) is required",
      });
    }

    if (!cleanSlug) {
      return res.status(400).json({
        status: "fail",
        message: "Slug is required",
      });
    }

    if (!shortDescription || !shortDescription.en || !shortDescription.en.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Short Description is required",
      });
    }

    const existingSlug = await PackageItem.findOne({ slug: cleanSlug });
    if (existingSlug) {
      return res.status(400).json({
        status: "fail",
        message: `A package with slug "${cleanSlug}" already exists. Please choose a unique slug.`,
      });
    }

    const parsedCat = parseField(req.body.packageCategory);
    const rawCategories = Array.isArray(parsedCat) ? parsedCat : parsedCat ? [parsedCat] : [];
    const packageCategory = rawCategories.length > 0 ? rawCategories : ["varkalaSightseeing"];

    const price = req.body.price !== undefined && req.body.price !== "" && !isNaN(Number(req.body.price))
      ? Number(req.body.price)
      : 0;
    const actualPrice = req.body.actualPrice !== undefined && req.body.actualPrice !== "" && !isNaN(Number(req.body.actualPrice))
      ? Number(req.body.actualPrice)
      : undefined;

    const pricePeriod = parseLocalizedOpt(req.body.pricePeriod);
    const duration = parseLocalizedOpt(req.body.duration);
    const tagline = parseLocalizedOpt(req.body.tagline);
    const aboutText = parseLocalizedOpt(req.body.aboutText);

    // Arrays/Objects
    const itinerary = parseField(req.body.itinerary) || [];
    const itineraryEvening = parseField(req.body.itineraryEvening) || [];
    const hasMultipleDays = req.body.hasMultipleDays === "true" || req.body.hasMultipleDays === true;
    const itineraryDays = parseField(req.body.itineraryDays) || [];
    const inclusions = parseField(req.body.inclusions) || [];
    const exclusions = parseField(req.body.exclusions) || [];
    const highlights = parseField(req.body.highlights) || [];
    const whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs) || [];

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

    const rawRelated = parseField(req.body.relatedPackages);
    const relatedPackages = Array.isArray(rawRelated) ? rawRelated.filter(Boolean) : [];

    const newItem = new PackageItem({
      packageCategory,
      title,
      slug: cleanSlug,
      price,
      actualPrice,
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
      hasMultipleDays,
      itineraryDays,
      inclusions,
      exclusions,
      highlights,
      whyGuestsLoveUs,

      // General Info
      travelTime: parseLocalizedOpt(req.body.travelTime),
      entryFee: parseLocalizedOpt(req.body.entryFee),
      optionalCharges: parseLocalizedOpt(req.body.optionalCharges),
      difficulty: parseLocalizedOpt(req.body.difficulty),
      groupSize: parseLocalizedOpt(req.body.groupSize),
      location: parseLocalizedOpt(req.body.location),

      // Localized Content
      tourOverview: parseLocalizedOpt(req.body.tourOverview),
      bestTime: parseLocalizedOpt(req.body.bestTime),
      dressCode: parseLocalizedOpt(req.body.dressCode),
      cta: parseLocalizedOpt(req.body.cta),

      // Media
      gallery: galleryUrls,
      galleryPublicIds: galleryPublicIds,
      video: req.body.video || "",

      // Structural lists
      quickFacts: parseField(req.body.quickFacts) || [],
      thingsToBring: parseField(req.body.thingsToBring) || [],
      nearbyAttractions: parseField(req.body.nearbyAttractions) || [],
      relatedPackages,
      faqs: parseField(req.body.faqs) || [],

      // SEO
      metaTitle: parseLocalizedOpt(req.body.metaTitle),
      metaDescription: parseLocalizedOpt(req.body.metaDescription),
      keywords: parseLocalizedOpt(req.body.keywords),
      ogImage: ogImageUrl,
      ogImagePublicId: ogImagePublicId,
      canonicalUrl: req.body.canonicalUrl || "",

      // Booking Info
      cancellation: parseLocalizedOpt(req.body.cancellation),
      refund: parseLocalizedOpt(req.body.refund),
      pickup: parseLocalizedOpt(req.body.pickup),
      drop: parseLocalizedOpt(req.body.drop),
      notes: parseLocalizedOpt(req.body.notes),
      hideRate: req.body.hideRate === "true" || req.body.hideRate === true,
      badgeText: parseLocalizedOpt(req.body.badgeText),
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

    if (req.body.packageCategory) {
      const parsedCat = parseField(req.body.packageCategory);
      item.packageCategory = Array.isArray(parsedCat) ? parsedCat : parsedCat ? [parsedCat] : [];
    }
    if (req.body.slug) {
      const cleanSlug = req.body.slug.trim();
      const existingSlug = await PackageItem.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (existingSlug) {
        return res.status(400).json({
          status: "fail",
          message: `A package with slug "${cleanSlug}" already exists. Please choose a unique slug.`,
        });
      }
      item.slug = cleanSlug;
    }
    if (req.body.price !== undefined && req.body.price !== "") {
      item.price = Number(req.body.price);
    }
    if (req.body.actualPrice !== undefined) {
      item.actualPrice = req.body.actualPrice ? Number(req.body.actualPrice) : undefined;
    }
    if (req.body.video !== undefined) item.video = req.body.video;
    if (req.body.canonicalUrl !== undefined) item.canonicalUrl = req.body.canonicalUrl;

    // Localized fields with translation-preserving merge
    if (req.body.title !== undefined) item.title = mergeLocalized(item.title, req.body.title);
    if (req.body.pricePeriod !== undefined) item.pricePeriod = mergeLocalized(item.pricePeriod, req.body.pricePeriod);
    if (req.body.duration !== undefined) item.duration = mergeLocalized(item.duration, req.body.duration);
    if (req.body.shortDescription !== undefined) item.shortDescription = mergeLocalized(item.shortDescription, req.body.shortDescription);
    if (req.body.tagline !== undefined) item.tagline = mergeLocalized(item.tagline, req.body.tagline);
    if (req.body.aboutText !== undefined) item.aboutText = mergeLocalized(item.aboutText, req.body.aboutText);

    if (req.body.travelTime !== undefined) item.travelTime = mergeLocalized(item.travelTime, req.body.travelTime);
    if (req.body.entryFee !== undefined) item.entryFee = mergeLocalized(item.entryFee, req.body.entryFee);
    if (req.body.optionalCharges !== undefined) item.optionalCharges = mergeLocalized(item.optionalCharges, req.body.optionalCharges);
    if (req.body.difficulty !== undefined) item.difficulty = mergeLocalized(item.difficulty, req.body.difficulty);
    if (req.body.groupSize !== undefined) item.groupSize = mergeLocalized(item.groupSize, req.body.groupSize);
    if (req.body.location !== undefined) item.location = mergeLocalized(item.location, req.body.location);

    if (req.body.tourOverview !== undefined) item.tourOverview = mergeLocalized(item.tourOverview, req.body.tourOverview);
    if (req.body.bestTime !== undefined) item.bestTime = mergeLocalized(item.bestTime, req.body.bestTime);
    if (req.body.dressCode !== undefined) item.dressCode = mergeLocalized(item.dressCode, req.body.dressCode);
    if (req.body.cta !== undefined) item.cta = mergeLocalized(item.cta, req.body.cta);

    if (req.body.metaTitle !== undefined) item.metaTitle = mergeLocalized(item.metaTitle, req.body.metaTitle);
    if (req.body.metaDescription !== undefined) item.metaDescription = mergeLocalized(item.metaDescription, req.body.metaDescription);
    if (req.body.keywords !== undefined) item.keywords = mergeLocalized(item.keywords, req.body.keywords);

    if (req.body.cancellation !== undefined) item.cancellation = mergeLocalized(item.cancellation, req.body.cancellation);
    if (req.body.refund !== undefined) item.refund = mergeLocalized(item.refund, req.body.refund);
    if (req.body.pickup !== undefined) item.pickup = mergeLocalized(item.pickup, req.body.pickup);
    if (req.body.drop !== undefined) item.drop = mergeLocalized(item.drop, req.body.drop);
    if (req.body.notes !== undefined) item.notes = mergeLocalized(item.notes, req.body.notes);
    if (!item.notes) {
      item.notes = { en: "", de: "", fr: "", ru: "" } as any;
    }
    if (req.body.hideRate !== undefined) {
      item.hideRate = req.body.hideRate === "true" || req.body.hideRate === true;
    }
    if (req.body.badgeText !== undefined) {
      item.badgeText = mergeLocalized(item.badgeText, req.body.badgeText);
    }

    // Lists
    if (req.body.hasMultipleDays !== undefined) {
      item.hasMultipleDays = req.body.hasMultipleDays === "true" || req.body.hasMultipleDays === true;
    }
    if (req.body.itineraryDays !== undefined) item.itineraryDays = parseField(req.body.itineraryDays);
    if (req.body.itinerary !== undefined) item.itinerary = parseField(req.body.itinerary);
    if (req.body.itineraryEvening !== undefined) item.itineraryEvening = parseField(req.body.itineraryEvening);
    if (req.body.inclusions !== undefined) item.inclusions = parseField(req.body.inclusions);
    if (req.body.exclusions !== undefined) item.exclusions = parseField(req.body.exclusions);
    if (req.body.highlights !== undefined) item.highlights = parseField(req.body.highlights);
    if (req.body.whyGuestsLoveUs !== undefined) item.whyGuestsLoveUs = parseField(req.body.whyGuestsLoveUs);
    if (req.body.quickFacts !== undefined) item.quickFacts = parseField(req.body.quickFacts);
    if (req.body.thingsToBring !== undefined) item.thingsToBring = parseField(req.body.thingsToBring);
    if (req.body.nearbyAttractions !== undefined) item.nearbyAttractions = parseField(req.body.nearbyAttractions);
    if (req.body.relatedPackages !== undefined) {
      const rawRel = parseField(req.body.relatedPackages);
      item.relatedPackages = Array.isArray(rawRel) ? rawRel.filter(Boolean) : [];
    }
    if (req.body.faqs !== undefined) item.faqs = parseField(req.body.faqs);

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
