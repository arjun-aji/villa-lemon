import { Schema, model } from "mongoose";
import { IFAQ } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, required: true },
    fr: { type: String, required: true },
    ru: { type: String, required: true },
  },
  { _id: false }
);

const faqSchema = new Schema<IFAQ>(
  {
    question: { type: localizedTextSchema, required: true },
    answer: { type: localizedTextSchema, required: true },
    category: { type: String, required: true, default: "General" },
  },
  {
    timestamps: true,
  }
);

export const FAQ = model<IFAQ>("FAQ", faqSchema);
