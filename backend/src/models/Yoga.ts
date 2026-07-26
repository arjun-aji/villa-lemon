import { Schema, model } from "mongoose";
import { IYogaProgram, ITeacher } from "../types";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    de: { type: String, required: true },
    fr: { type: String, required: true },
    ru: { type: String, required: true },
  },
  { _id: false }
);

const yogaProgramSchema = new Schema<IYogaProgram>(
  {
    type: {
      type: String,
      enum: ["retreats", "classes", "private"],
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

const teacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    role: { type: localizedTextSchema, required: true },
    bio: { type: localizedTextSchema, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const YogaProgram = model<IYogaProgram>("YogaProgram", yogaProgramSchema);
export const Teacher = model<ITeacher>("Teacher", teacherSchema);
