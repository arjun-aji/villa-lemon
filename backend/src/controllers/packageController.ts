import { Request, Response } from "express";
import { Package } from "../models/Package";
import { uploadImage, deleteImage } from "../utils/cloudinaryUpload";

const parseField = (field: any) => {
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return field;
    }
  }
  return field;
};

export const getAllPackages = async (req: Request, res: Response): Promise<any> => {
  try {
    const filter: any = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const packages = await Package.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: packages.length,
      data: packages,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch packages",
    });
  }
};

export const createPackage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category, href } = req.body;
    
    const title = parseField(req.body.title);
    const description = parseField(req.body.description);
    const explore = parseField(req.body.explore);

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "An image file is required for creating a package",
      });
    }

    // Upload to Cloudinary folder 'packages'
    const uploadResult = await uploadImage(req.file.buffer, "packages");

    const newPackage = new Package({
      category,
      title,
      description,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      explore,
      href: href || "#contact",
    });

    await newPackage.save();

    res.status(201).json({
      status: "success",
      data: newPackage,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create package",
    });
  }
};

export const updatePackage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const pkg = await Package.findById(id);

    if (!pkg) {
      return res.status(404).json({
        status: "fail",
        message: "Package not found",
      });
    }

    if (req.body.category) pkg.category = req.body.category;
    if (req.body.href) pkg.href = req.body.href;
    if (req.body.title) pkg.title = { ...pkg.title, ...parseField(req.body.title) };
    if (req.body.description) pkg.description = { ...pkg.description, ...parseField(req.body.description) };
    if (req.body.explore) pkg.explore = { ...pkg.explore, ...parseField(req.body.explore) };

    if (req.file) {
      // Delete old from Cloudinary
      if (pkg.imagePublicId) {
        await deleteImage(pkg.imagePublicId).catch(err => {
          console.warn(`[cloudinary]: Image delete failed: ${err.message}`);
        });
      }

      // Upload new image
      const uploadResult = await uploadImage(req.file.buffer, "packages");
      pkg.image = uploadResult.secure_url;
      pkg.imagePublicId = uploadResult.public_id;
    }

    await pkg.save();

    res.status(200).json({
      status: "success",
      data: pkg,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update package",
    });
  }
};

export const deletePackage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const pkg = await Package.findById(id);

    if (!pkg) {
      return res.status(404).json({
        status: "fail",
        message: "Package not found",
      });
    }

    // Delete image from Cloudinary
    if (pkg.imagePublicId) {
      await deleteImage(pkg.imagePublicId).catch(err => {
        console.warn(`[cloudinary]: Image delete failed: ${err.message}`);
      });
    }

    await Package.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Package deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to delete package",
    });
  }
};
