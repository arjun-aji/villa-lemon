import { Schema, model } from "mongoose";
import { IPackage } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, required: true },
    fr: { type: String, required: true },
    ru: { type: String, required: true },
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
    explore: { type: localizedTextSchema, required: true },
    href: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Package = model<IPackage>("Package", packageSchema);
