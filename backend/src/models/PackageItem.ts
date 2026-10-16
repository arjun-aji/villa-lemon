import { Schema, model } from "mongoose";
import { IPackageItem } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, default: "" },
    fr: { type: String, default: "" },
    ru: { type: String, default: "" },
  },
  { _id: false }
);

const optionalLocalizedTextSchema = new Schema(
  {
    en: { type: String, default: "" },
    de: { type: String, default: "" },
    fr: { type: String, default: "" },
    ru: { type: String, default: "" },
  },
  { _id: false }
);

const highlightSchema = new Schema(
  {
    icon: { type: String, default: "sparkles" },
    label: { type: optionalLocalizedTextSchema },
  },
  { _id: false }
);

const whyLoveUsSchema = new Schema(
  {
    icon: { type: String, required: false, default: "" },
    title: { type: optionalLocalizedTextSchema },
    desc: { type: optionalLocalizedTextSchema },
  },
  { _id: false }
);

const itinerarySchema = new Schema(
  {
    timeOrDay: { type: optionalLocalizedTextSchema },
    activity: { type: optionalLocalizedTextSchema },
    desc: { type: optionalLocalizedTextSchema },
  },
  { _id: false }
);

const quickFactSchema = new Schema(
  {
    key: { type: optionalLocalizedTextSchema },
    value: { type: optionalLocalizedTextSchema },
  },
  { _id: false }
);

const attractionSchema = new Schema(
  {
    name: { type: optionalLocalizedTextSchema },
    distance: { type: optionalLocalizedTextSchema },
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: optionalLocalizedTextSchema },
    answer: { type: optionalLocalizedTextSchema },
  },
  { _id: false }
);

const packageItemSchema = new Schema<IPackageItem>(
  {
    packageCategory: {
      type: [String],
      enum: ["varkalaSightseeing", "dayTrips", "backwaterExperiences", "adventureActivities", "varkalaPackages"],
      required: true,
      default: ["varkalaSightseeing"],
    },
    title: { type: localizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, default: 0 },
    actualPrice: { type: Number },
    pricePeriod: { type: optionalLocalizedTextSchema },
    image: { type: String, default: "" },
    imagePublicId: { type: String },
    images: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    aboutImage: { type: String, default: "" },
    aboutImagePublicId: { type: String },
    aboutImages: { type: [String], default: [] },
    aboutImagePublicIds: { type: [String], default: [] },
    duration: { type: optionalLocalizedTextSchema },
    shortDescription: { type: localizedTextSchema, required: true },
    tagline: { type: optionalLocalizedTextSchema },
    aboutText: { type: optionalLocalizedTextSchema },
    itinerary: [itinerarySchema],
    itineraryEvening: [itinerarySchema],
    inclusions: [optionalLocalizedTextSchema],
    exclusions: [optionalLocalizedTextSchema],
    highlights: [highlightSchema],
    whyGuestsLoveUs: [whyLoveUsSchema],

    // General Info
    travelTime: { type: optionalLocalizedTextSchema },
    entryFee: { type: optionalLocalizedTextSchema },
    optionalCharges: { type: optionalLocalizedTextSchema },
    difficulty: { type: optionalLocalizedTextSchema },
    groupSize: { type: optionalLocalizedTextSchema },
    location: { type: optionalLocalizedTextSchema },

    // Localized Content
    tourOverview: { type: optionalLocalizedTextSchema },
    bestTime: { type: optionalLocalizedTextSchema },
    dressCode: { type: optionalLocalizedTextSchema },
    cta: { type: optionalLocalizedTextSchema },

    // Images & Media
    gallery: [{ type: String }],
    galleryPublicIds: [{ type: String }],
    video: { type: String, default: "" },

    // Structural lists
    quickFacts: [quickFactSchema],
    thingsToBring: [optionalLocalizedTextSchema],
    nearbyAttractions: [attractionSchema],
    relatedPackages: [{ type: String }],
    faqs: [faqSchema],

    // SEO
    metaTitle: { type: optionalLocalizedTextSchema },
    metaDescription: { type: optionalLocalizedTextSchema },
    keywords: { type: optionalLocalizedTextSchema },
    ogImage: { type: String, default: "" },
    ogImagePublicId: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },

    // Booking Info
    cancellation: { type: optionalLocalizedTextSchema },
    refund: { type: optionalLocalizedTextSchema },
    pickup: { type: optionalLocalizedTextSchema },
    drop: { type: optionalLocalizedTextSchema },
    notes: { type: optionalLocalizedTextSchema, default: () => ({ en: "", de: "", fr: "", ru: "" }) },
    displayOrder: { type: Number, default: 0 },
    hideRate: { type: Boolean, default: false },
    badgeText: { type: optionalLocalizedTextSchema, default: () => ({ en: "", de: "", fr: "", ru: "" }) },
  },
  {
    timestamps: true,
  }
);

export const PackageItem = model<IPackageItem>("PackageItem", packageItemSchema);
