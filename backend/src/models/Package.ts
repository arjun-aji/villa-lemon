import { Schema, model } from "mongoose";
import { IPackage } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, default: "" },
    fr: { type: String, default: "" },
    ru: { type: String, default: "" },
  },
  { _id: false }
);

const packageSchema = new Schema<IPackage>(
  {
    category: {
      type: String,
      required: true,
    },
    title: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    images: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    explore: { type: localizedTextSchema, required: true },
    href: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    template: { type: String, default: "default" },
  },
  {
    timestamps: true,
  }
);

export const Package = model<IPackage>("Package", packageSchema);
