import { Schema, model } from "mongoose";
import { IAccommodation } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, default: "" },
    fr: { type: String, default: "" },
    ru: { type: String, default: "" },
  },
  { _id: false }
);

const accommodationSchema = new Schema<IAccommodation>(
  {
    type: {
      type: String,
      enum: ["villa", "floor", "room"],
      required: true,
    },
    title: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },
    price: { type: localizedTextSchema, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    images: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    explore: { type: localizedTextSchema, required: true },
    href: { type: String, required: true },
    feature1Title: { type: localizedTextSchema, default: () => ({ en: "Private Pool", de: "", fr: "", ru: "" }) },
    feature1Subtitle: { type: localizedTextSchema, default: () => ({ en: "In most villas", de: "", fr: "", ru: "" }) },
    feature2Title: { type: localizedTextSchema, default: () => ({ en: "Spacious Living", de: "", fr: "", ru: "" }) },
    feature2Subtitle: { type: localizedTextSchema, default: () => ({ en: "For families & groups", de: "", fr: "", ru: "" }) },
    feature3Title: { type: localizedTextSchema, default: () => ({ en: "Premium Amenities", de: "", fr: "", ru: "" }) },
    feature3Subtitle: { type: localizedTextSchema, default: () => ({ en: "Luxury redefined", de: "", fr: "", ru: "" }) },
    feature4Title: { type: localizedTextSchema, default: () => ({ en: "Dedicated Service", de: "", fr: "", ru: "" }) },
    feature4Subtitle: { type: localizedTextSchema, default: () => ({ en: "24/7 assistance", de: "", fr: "", ru: "" }) },
    displayOrder: { type: Number, default: 0 },
    template: { type: String, default: "default" },
  },
  {
    timestamps: true,
  }
);

export const Accommodation = model<IAccommodation>("Accommodation", accommodationSchema);
