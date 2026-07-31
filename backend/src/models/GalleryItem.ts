import { Schema, model } from "mongoose";

const localizedTextSchema = new Schema(
  {
    en: { type: String, default: "" },
    de: { type: String, default: "" },
    fr: { type: String, default: "" },
    ru: { type: String, default: "" },
  },
  { _id: false }
);

const galleryItemSchema = new Schema(
  {
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: [
        "villa-accommodation",
        "yoga-wellness",
        "experiences-tours",
        "food-dining",
        "nature-surroundings",
        "events-culture"
      ]
    },
    caption: { type: localizedTextSchema, required: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const GalleryItem = model("GalleryItem", galleryItemSchema);
export default GalleryItem;
