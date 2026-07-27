import { Request, Response } from "express";
import { Retreat } from "../models/Retreat";
import { uploadImage, deleteImage } from "../utils/cloudinaryUpload";

const pf = (field: any) => {
  if (typeof field === "string") {
    try { return JSON.parse(field); } catch { return field; }
  }
  return field;
};

// ─── GET ALL ────────────────────────────────────────────────────────────────

export const getAllRetreats = async (req: Request, res: Response): Promise<any> => {
  try {
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.featured === "true") filter.featured = true;
    if (req.query.upcoming === "true") filter.isUpcoming = true;

    const retreats = await Retreat.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ status: "success", results: retreats.length, data: retreats });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ─── GET ONE ─────────────────────────────────────────────────────────────────

export const getRetreatBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const retreat = await Retreat.findOne({ slug });
    if (!retreat) return res.status(404).json({ status: "fail", message: "Retreat not found" });
    res.status(200).json({ status: "success", data: retreat });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ─── CREATE ──────────────────────────────────────────────────────────────────

export const createRetreat = async (req: Request, res: Response): Promise<any> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Hero image upload
    let heroImage = "", heroImagePublicId = "";
    if (files?.heroImage?.[0]) {
      const up = await uploadImage(files.heroImage[0].buffer, "retreats");
      heroImage = up.secure_url; heroImagePublicId = up.public_id;
    }

    // Teacher photos (array of files named teacherPhotos)
    const teachers = pf(req.body.teachers) || [];
    const teacherPhotoFiles = files?.teacherPhotos || [];
    for (let i = 0; i < teacherPhotoFiles.length && i < teachers.length; i++) {
      const up = await uploadImage(teacherPhotoFiles[i].buffer, "retreats/teachers");
      teachers[i].photo = up.secure_url;
      teachers[i].photoPublicId = up.public_id;
    }

    // Room images
    const rooms = pf(req.body.rooms) || [];
    const roomImageFiles = files?.roomImages || [];
    for (let i = 0; i < roomImageFiles.length && i < rooms.length; i++) {
      const up = await uploadImage(roomImageFiles[i].buffer, "retreats/rooms");
      rooms[i].image = up.secure_url;
      rooms[i].imagePublicId = up.public_id;
    }

    // Gallery uploads (per category)
    const uploadGallery = async (fieldname: string, folder: string) => {
      const galleryFiles = files?.[fieldname] || [];
      if (!galleryFiles.length) return [];
      const ups = await Promise.all(galleryFiles.map((f) => uploadImage(f.buffer, folder)));
      return ups.map((u) => u.secure_url);
    };

    const [galleryYoga, galleryAccommodation, galleryExcursions, galleryFood, galleryTeachers, galleryBeach, galleryStudents, galleryCampus] = await Promise.all([
      uploadGallery("galleryYoga", "retreats/gallery/yoga"),
      uploadGallery("galleryAccommodation", "retreats/gallery/accommodation"),
      uploadGallery("galleryExcursions", "retreats/gallery/excursions"),
      uploadGallery("galleryFood", "retreats/gallery/food"),
      uploadGallery("galleryTeachers", "retreats/gallery/teachers"),
      uploadGallery("galleryBeach", "retreats/gallery/beach"),
      uploadGallery("galleryStudents", "retreats/gallery/students"),
      uploadGallery("galleryCampus", "retreats/gallery/campus"),
    ]);

    // OG Image
    let ogImage = "", ogImagePublicId = "";
    if (files?.ogImage?.[0]) {
      const up = await uploadImage(files.ogImage[0].buffer, "retreats/seo");
      ogImage = up.secure_url; ogImagePublicId = up.public_id;
    }

    const retreat = new Retreat({
      // General Info
      slug: req.body.slug,
      days: Number(req.body.days || 7),
      nights: Number(req.body.nights || 7),
      price: Number(req.body.price || 0),
      location: pf(req.body.location),
      difficulty: pf(req.body.difficulty),
      yogaLevel: pf(req.body.yogaLevel),
      language: pf(req.body.language),
      groupSize: pf(req.body.groupSize),
      minAge: Number(req.body.minAge || 18),
      maxCapacity: Number(req.body.maxCapacity || 20),
      certificate: req.body.certificate === "true",
      accommodationType: pf(req.body.accommodationType),
      status: req.body.status || "draft",
      featured: req.body.featured === "true",
      displayOrder: Number(req.body.displayOrder || 0),

      // Content
      heroTitle: pf(req.body.heroTitle),
      heroSubtitle: pf(req.body.heroSubtitle),
      tagline: pf(req.body.tagline),
      shortDescription: pf(req.body.shortDescription),
      fullDescription: pf(req.body.fullDescription),
      retreatOverview: pf(req.body.retreatOverview),
      whyChoose: pf(req.body.whyChoose),
      whoIsItFor: pf(req.body.whoIsItFor),
      bestTime: pf(req.body.bestTime),
      cta: pf(req.body.cta),

      // Media
      heroImage, heroImagePublicId,
      video: req.body.video || "",
      retreatMap: req.body.retreatMap || "",
      brochurePdf: req.body.brochurePdf || "",

      // Sections
      highlights: pf(req.body.highlights) || [],
      dailySchedule: pf(req.body.dailySchedule) || [],
      curriculum: pf(req.body.curriculum) || [],
      excursions: pf(req.body.excursions) || [],
      rooms,
      meals: pf(req.body.meals) || [],

      // Yoga Program
      yogaStyle: pf(req.body.yogaStyle),
      morningSession: pf(req.body.morningSession),
      eveningSession: pf(req.body.eveningSession),
      meditation: pf(req.body.meditation),
      pranayama: pf(req.body.pranayama),
      philosophy: pf(req.body.philosophy),
      classLanguage: pf(req.body.classLanguage),
      suitableFor: pf(req.body.suitableFor),
      yogaCertificate: pf(req.body.yogaCertificate),
      yogaHours: Number(req.body.yogaHours || 0),
      yogaDescription: pf(req.body.yogaDescription),

      // Teachers
      teachers,

      // Ayurveda
      ayurvedaTitle: pf(req.body.ayurvedaTitle),
      ayurvedaDescription: pf(req.body.ayurvedaDescription),
      ayurvedaTreatments: pf(req.body.ayurvedaTreatments) || [],

      // Pricing
      pricingRows: pf(req.body.pricingRows) || [],

      // Checklists
      inclusions: pf(req.body.inclusions) || [],
      exclusions: pf(req.body.exclusions) || [],
      thingsToBring: pf(req.body.thingsToBring) || [],
      dressCode: pf(req.body.dressCode) || [],
      requirements: pf(req.body.requirements) || [],
      whoShouldAvoid: pf(req.body.whoShouldAvoid) || [],

      // FAQs
      faqs: pf(req.body.faqs) || [],

      // Reviews
      reviews: pf(req.body.reviews) || [],

      // Certificates
      certificates: pf(req.body.certificates) || [],

      // Gallery
      galleryYoga, galleryAccommodation, galleryExcursions, galleryFood,
      galleryTeachers, galleryBeach, galleryStudents, galleryCampus,

      // Downloads
      brochureUrl: req.body.brochureUrl || "",
      packingListUrl: req.body.packingListUrl || "",
      schedulePdfUrl: req.body.schedulePdfUrl || "",
      termsPdfUrl: req.body.termsPdfUrl || "",

      // Booking
      deposit: pf(req.body.deposit),
      balancePayment: pf(req.body.balancePayment),
      cancellation: pf(req.body.cancellation),
      refund: pf(req.body.refund),
      pickup: pf(req.body.pickup),
      drop: pf(req.body.drop),
      checkIn: req.body.checkIn || "12:00 PM",
      checkOut: req.body.checkOut || "11:00 AM",
      emergencyContact: req.body.emergencyContact || "",
      medicalInfo: pf(req.body.medicalInfo),
      specialRequests: pf(req.body.specialRequests),
      bookingTerms: pf(req.body.bookingTerms),

      // Settings
      maxParticipants: Number(req.body.maxParticipants || 20),
      minParticipants: Number(req.body.minParticipants || 2),
      bookingOpen: req.body.bookingOpen !== "false",
      availableDates: pf(req.body.availableDates) || [],
      isPopular: req.body.isPopular === "true",
      isSoldOut: req.body.isSoldOut === "true",
      isUpcoming: req.body.isUpcoming === "true",

      // SEO
      metaTitle: pf(req.body.metaTitle),
      metaDescription: pf(req.body.metaDescription),
      keywords: pf(req.body.keywords),
      ogImage, ogImagePublicId,
      canonicalUrl: req.body.canonicalUrl || "",
    });

    await retreat.save();
    res.status(201).json({ status: "success", data: retreat });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export const updateRetreat = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const retreat = await Retreat.findById(id);
    if (!retreat) return res.status(404).json({ status: "fail", message: "Retreat not found" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Hero image
    if (files?.heroImage?.[0]) {
      if (retreat.heroImagePublicId) await deleteImage(retreat.heroImagePublicId);
      const up = await uploadImage(files.heroImage[0].buffer, "retreats");
      retreat.heroImage = up.secure_url;
      retreat.heroImagePublicId = up.public_id;
    }

    // Teacher photos
    const teachers = pf(req.body.teachers) || retreat.teachers;
    const teacherPhotoFiles = files?.teacherPhotos || [];
    for (let i = 0; i < teacherPhotoFiles.length && i < teachers.length; i++) {
      const up = await uploadImage(teacherPhotoFiles[i].buffer, "retreats/teachers");
      teachers[i].photo = up.secure_url;
      teachers[i].photoPublicId = up.public_id;
    }
    retreat.teachers = teachers;

    // Room images
    const rooms = pf(req.body.rooms) || retreat.rooms;
    const roomImageFiles = files?.roomImages || [];
    for (let i = 0; i < roomImageFiles.length && i < rooms.length; i++) {
      const up = await uploadImage(roomImageFiles[i].buffer, "retreats/rooms");
      rooms[i].image = up.secure_url;
      rooms[i].imagePublicId = up.public_id;
    }
    retreat.rooms = rooms;

    // OG Image
    if (files?.ogImage?.[0]) {
      if (retreat.ogImagePublicId) await deleteImage(retreat.ogImagePublicId);
      const up = await uploadImage(files.ogImage[0].buffer, "retreats/seo");
      retreat.ogImage = up.secure_url;
      retreat.ogImagePublicId = up.public_id;
    }

    // Update all scalar/localized fields
    const update = (key: string) => { if (req.body[key] !== undefined) (retreat as any)[key] = pf(req.body[key]); };
    const updateNum = (key: string) => { if (req.body[key] !== undefined) (retreat as any)[key] = Number(req.body[key]); };
    const updateBool = (key: string, val: string) => { if (req.body[key] !== undefined) (retreat as any)[key] = req.body[key] === val; };

    ["slug","video","retreatMap","brochurePdf","checkIn","checkOut","emergencyContact","canonicalUrl","brochureUrl","packingListUrl","schedulePdfUrl","termsPdfUrl","status"].forEach(update);
    ["heroTitle","heroSubtitle","tagline","shortDescription","fullDescription","retreatOverview","whyChoose","whoIsItFor","bestTime","cta","location","difficulty","yogaLevel","language","groupSize","accommodationType","yogaStyle","morningSession","eveningSession","meditation","pranayama","philosophy","classLanguage","suitableFor","yogaCertificate","yogaDescription","ayurvedaTitle","ayurvedaDescription","deposit","balancePayment","cancellation","refund","pickup","drop","medicalInfo","specialRequests","bookingTerms","metaTitle","metaDescription","keywords"].forEach(update);
    ["days","nights","price","minAge","maxCapacity","yogaHours","maxParticipants","minParticipants","displayOrder"].forEach(updateNum);
    updateBool("certificate", "true");
    updateBool("featured", "true");
    updateBool("bookingOpen", "true");
    updateBool("isPopular", "true");
    updateBool("isSoldOut", "true");
    updateBool("isUpcoming", "true");

    ["highlights","dailySchedule","curriculum","excursions","meals","ayurvedaTreatments","pricingRows","inclusions","exclusions","thingsToBring","dressCode","requirements","whoShouldAvoid","faqs","reviews","certificates","availableDates"].forEach((k) => {
      if (req.body[k] !== undefined) (retreat as any)[k] = pf(req.body[k]);
    });

    await retreat.save();
    res.status(200).json({ status: "success", data: retreat });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ─── DELETE ──────────────────────────────────────────────────────────────────

export const deleteRetreat = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const retreat = await Retreat.findById(id);
    if (!retreat) return res.status(404).json({ status: "fail", message: "Retreat not found" });

    if (retreat.heroImagePublicId) await deleteImage(retreat.heroImagePublicId);
    if (retreat.ogImagePublicId) await deleteImage(retreat.ogImagePublicId);

    await retreat.deleteOne();
    res.status(200).json({ status: "success", message: "Retreat deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
