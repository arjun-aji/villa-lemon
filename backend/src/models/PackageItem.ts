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

const highlightSchema = new Schema(
  {
    icon: { type: String, required: true },
    label: { type: localizedTextSchema, required: true },
  },
  { _id: false }
);

const whyLoveUsSchema = new Schema(
  {
    icon: { type: String, required: false, default: "" },
    title: { type: localizedTextSchema },
    desc: { type: localizedTextSchema },
  },
  { _id: false }
);

const itinerarySchema = new Schema(
  {
    timeOrDay: { type: localizedTextSchema },
    activity: { type: localizedTextSchema },
    desc: { type: localizedTextSchema },
  },
  { _id: false }
);

const quickFactSchema = new Schema(
  {
    key: { type: localizedTextSchema },
    value: { type: localizedTextSchema },
  },
  { _id: false }
);

const attractionSchema = new Schema(
  {
    name: { type: localizedTextSchema },
    distance: { type: localizedTextSchema },
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: localizedTextSchema },
    answer: { type: localizedTextSchema },
  },
  { _id: false }
);

const packageItemSchema = new Schema<IPackageItem>(
  {
    packageCategory: {
      type: String,
      enum: ["varkalaSightseeing", "dayTrips", "backwaterExperiences", "adventureActivities", "varkalaPackages"],
      required: true,
    },
    title: { type: localizedTextSchema },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, default: 0 },
    pricePeriod: { type: localizedTextSchema },
    image: { type: String, default: "" },
    imagePublicId: { type: String },
    images: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    aboutImage: { type: String, default: "" },
    aboutImagePublicId: { type: String },
    aboutImages: { type: [String], default: [] },
    aboutImagePublicIds: { type: [String], default: [] },
    duration: { type: localizedTextSchema },
    shortDescription: { type: localizedTextSchema },
    tagline: { type: localizedTextSchema },
    aboutText: { type: localizedTextSchema },
    itinerary: [itinerarySchema],
    itineraryEvening: [itinerarySchema],
    inclusions: [localizedTextSchema],
    exclusions: [localizedTextSchema],
    highlights: [highlightSchema],
    whyGuestsLoveUs: [whyLoveUsSchema],

    // General Info
    travelTime: { type: localizedTextSchema },
    entryFee: { type: localizedTextSchema },
    optionalCharges: { type: localizedTextSchema },
    difficulty: { type: localizedTextSchema },
    groupSize: { type: localizedTextSchema },
    location: { type: localizedTextSchema },

    // Localized Content
    tourOverview: { type: localizedTextSchema },
    bestTime: { type: localizedTextSchema },
    dressCode: { type: localizedTextSchema },
    cta: { type: localizedTextSchema },

    // Images & Media
    gallery: [{ type: String }],
    galleryPublicIds: [{ type: String }],
    video: { type: String, default: "" },

    // Structural lists
    quickFacts: [quickFactSchema],
    thingsToBring: [localizedTextSchema],
    nearbyAttractions: [attractionSchema],
    relatedPackages: [{ type: String }],
    faqs: [faqSchema],

    // SEO
    metaTitle: { type: localizedTextSchema },
    metaDescription: { type: localizedTextSchema },
    keywords: { type: localizedTextSchema },
    ogImage: { type: String, default: "" },
    ogImagePublicId: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },

    // Booking Info
    cancellation: { type: localizedTextSchema },
    refund: { type: localizedTextSchema },
    pickup: { type: localizedTextSchema },
    drop: { type: localizedTextSchema },
    notes: { type: localizedTextSchema },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const PackageItem = model<IPackageItem>("PackageItem", packageItemSchema);
