import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types"; // We will create backend/src/types/index.ts for shared TypeScript types!

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "editor",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if it has been modified
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (passwordAttempt: string): Promise<boolean> {
  return bcrypt.compare(passwordAttempt, this.password);
};

export const User = model<IUser>("User", userSchema);
