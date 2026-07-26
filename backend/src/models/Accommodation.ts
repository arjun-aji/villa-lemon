import { Schema, model } from "mongoose";
import { IAccommodation } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, required: true },
    fr: { type: String, required: true },
    ru: { type: String, required: true },
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
    explore: { type: localizedTextSchema, required: true },
    href: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Accommodation = model<IAccommodation>("Accommodation", accommodationSchema);
