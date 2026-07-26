import { Schema, model } from "mongoose";
import { IHomepage } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, required: true },
    fr: { type: String, required: true },
    ru: { type: String, required: true },
  },
  { _id: false }
);

const homepageSchema = new Schema<IHomepage>(
  {
    hero: {
      tagline: { type: localizedTextSchema, required: true },
      headingPart1: { type: localizedTextSchema, required: true },
      headingPart2: { type: localizedTextSchema, required: true },
      nature: { type: localizedTextSchema, required: true },
      description: { type: localizedTextSchema, required: true },
      bookStay: { type: localizedTextSchema, required: true },
      whatsappBooking: { type: localizedTextSchema, required: true },
      imageAlt: { type: localizedTextSchema, required: true },
    },
    highlights: {
      premiumVillasTitle: { type: localizedTextSchema, required: true },
      premiumVillasSubtitle: { type: localizedTextSchema, required: true },
      greatLocationsTitle: { type: localizedTextSchema, required: true },
      greatLocationsSubtitle: { type: localizedTextSchema, required: true },
      wellnessTitle: { type: localizedTextSchema, required: true },
      wellnessSubtitle: { type: localizedTextSchema, required: true },
    },
    about: {
      tagline: { type: localizedTextSchema, required: true },
      heading: { type: localizedTextSchema, required: true },
      paragraph1: { type: localizedTextSchema, required: true },
      paragraph2: { type: localizedTextSchema, required: true },
      button: { type: localizedTextSchema, required: true },
      // Continuation features
      natureTitle: { type: localizedTextSchema, required: true },
      natureDesc: { type: localizedTextSchema, required: true },
      luxuryTitle: { type: localizedTextSchema, required: true },
      luxuryDesc: { type: localizedTextSchema, required: true },
      serviceTitle: { type: localizedTextSchema, required: true },
      serviceDesc: { type: localizedTextSchema, required: true },
      everyoneTitle: { type: localizedTextSchema, required: true },
      everyoneDesc: { type: localizedTextSchema, required: true },
      // Quote
      quoteText: { type: localizedTextSchema, required: true },
      quoteAuthor: { type: localizedTextSchema, required: true },
      // Stats labels
      statsVillasLabel: { type: localizedTextSchema, required: true },
      statsGuestsLabel: { type: localizedTextSchema, required: true },
      statsRatingLabel: { type: localizedTextSchema, required: true },
      statsLocationLabel: { type: localizedTextSchema, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Homepage = model<IHomepage>("Homepage", homepageSchema);
