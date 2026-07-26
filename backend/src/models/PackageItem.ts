import { Schema, model } from "mongoose";
import { IPackageItem } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, required: true },
    fr: { type: String, required: true },
    ru: { type: String, required: true },
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
    icon: { type: String, required: true },
    title: { type: localizedTextSchema, required: true },
    desc: { type: localizedTextSchema, required: true },
  },
  { _id: false }
);

const itinerarySchema = new Schema(
  {
    timeOrDay: { type: localizedTextSchema, required: true },
    activity: { type: localizedTextSchema, required: true },
    desc: { type: localizedTextSchema, required: true },
  },
  { _id: false }
);

const packageItemSchema = new Schema<IPackageItem>(
  {
    packageCategory: {
      type: String,
      enum: ["varkalaSightseeing", "dayTrips", "backwaterExperiences", "adventureActivities"],
      required: true,
    },
    title: { type: localizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    pricePeriod: { type: localizedTextSchema, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    aboutImage: { type: String, required: true },
    aboutImagePublicId: { type: String },
    duration: { type: localizedTextSchema, required: true },
    shortDescription: { type: localizedTextSchema, required: true },
    tagline: { type: localizedTextSchema, required: true },
    aboutText: { type: localizedTextSchema, required: true },
    itinerary: [itinerarySchema],
    inclusions: [localizedTextSchema],
    exclusions: [localizedTextSchema],
    highlights: [highlightSchema],
    whyGuestsLoveUs: [whyLoveUsSchema],
  },
  {
    timestamps: true,
  }
);

export const PackageItem = model<IPackageItem>("PackageItem", packageItemSchema);
