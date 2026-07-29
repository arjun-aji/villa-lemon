import { Schema, model } from "mongoose";
import { IYogaItem } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, default: "" },
    fr: { type: String, default: "" },
    ru: { type: String, default: "" },
  },
  { _id: false }
);

const scheduleSchema = new Schema(
  {
    time: { type: localizedTextSchema, required: true },
    activity: { type: localizedTextSchema, required: true },
  },
  { _id: false }
);

const yogaItemSchema = new Schema<IYogaItem>(
  {
    yogaType: {
      type: String,
      required: true,
    },
    title: { type: localizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    pricePeriod: { type: localizedTextSchema, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    images: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    aboutImage: { type: String, required: true },
    aboutImagePublicId: { type: String },
    aboutImages: { type: [String], default: [] },
    aboutImagePublicIds: { type: [String], default: [] },
    duration: { type: localizedTextSchema, required: true },
    shortDescription: { type: localizedTextSchema, required: true },
    tagline: { type: localizedTextSchema, required: true },
    aboutText: { type: localizedTextSchema, required: true },
    schedule: [scheduleSchema],
    benefits: [localizedTextSchema],
    inclusions: [localizedTextSchema],
    relatedYoga: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const YogaItem = model<IYogaItem>("YogaItem", yogaItemSchema);
