import { Schema, model } from "mongoose";
import { IAccommodationItem } from "../types";

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

const distanceSchema = new Schema(
  {
    place: { type: localizedTextSchema, required: true },
    distance: { type: localizedTextSchema, required: true },
  },
  { _id: false }
);

const additionalServiceSchema = new Schema(
  {
    service: { type: localizedTextSchema, required: true },
    details: { type: localizedTextSchema, required: true },
  },
  { _id: false }
);

const accommodationItemSchema = new Schema<IAccommodationItem>(
  {
    accommodationType: {
      type: String,
      enum: ["villa", "floor", "room"],
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
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    guests: { type: Number, required: true },
    location: { type: localizedTextSchema, required: true },
    shortDescription: { type: localizedTextSchema, required: true },
    tagline: { type: localizedTextSchema, required: true },
    aboutText1: { type: localizedTextSchema, required: true },
    aboutText2: { type: localizedTextSchema, required: true },
    highlights: [highlightSchema],
    whyGuestsLoveUs: [whyLoveUsSchema],
    distances: [distanceSchema],
    perfectLocationText: { type: localizedTextSchema, required: true },
    roomAmenities: [localizedTextSchema],
    idealFor: [localizedTextSchema],
    groupAccommodationText: { type: localizedTextSchema, required: true },
    checkInTime: { type: String, required: true },
    checkOutTime: { type: String, required: true },
    checkInOutRules: [localizedTextSchema],
    additionalServices: [additionalServiceSchema],
    mapLink: { type: String, default: "" },
    gallery: [{ type: String }],
    galleryPublicIds: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const AccommodationItem = model<IAccommodationItem>("AccommodationItem", accommodationItemSchema);
