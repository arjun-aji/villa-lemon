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

    const packages = await Package.find(filter).sort({ displayOrder: 1, createdAt: -1 });

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

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");

    if (imageFiles.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "An image file is required for creating a package",
      });
    }

    // Upload to Cloudinary folder 'packages'
    const uploadPromises = imageFiles.map(file => uploadImage(file.buffer, "packages"));
    const uploadResults = await Promise.all(uploadPromises);

    const coverImages = uploadResults.map(res => res.secure_url);
    const coverImagePublicIds = uploadResults.map(res => res.public_id);

    const newPackage = new Package({
      category,
      title,
      description,
      image: coverImages[0],
      imagePublicId: coverImagePublicIds[0],
      images: coverImages,
      imagePublicIds: coverImagePublicIds,
      explore,
      href: href || "#contact",
      template: req.body.template || "default",
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
    if (req.body.template) pkg.template = req.body.template;

    const files = req.files as Express.Multer.File[] || [];
    const imageFiles = files.filter(f => f.fieldname === "images" || f.fieldname === "image");

    const existingImagesKept: string[] = req.body.existingImages ? parseField(req.body.existingImages) : null;

    if (existingImagesKept !== null || imageFiles.length > 0) {
      const keptSet = new Set(existingImagesKept ?? (pkg.images || []));
      const currentImages: string[] = pkg.images || (pkg.image ? [pkg.image] : []);
      const currentPublicIds: string[] = pkg.imagePublicIds || (pkg.imagePublicId ? [pkg.imagePublicId] : []);

      const idsToDelete = currentPublicIds.filter((pid, idx) => {
        const url = currentImages[idx];
        return url && !keptSet.has(url);
      });
      if (idsToDelete.length > 0) {
        await Promise.all(idsToDelete.map(id => deleteImage(id).catch(() => {})));
      }

      const keptUrls = currentImages.filter(url => keptSet.has(url));
      const keptPublicIds = currentPublicIds.filter((_, idx) => {
        const url = currentImages[idx];
        return url && keptSet.has(url);
      });

      let newUrls: string[] = [];
      let newPublicIds: string[] = [];
      if (imageFiles.length > 0) {
        const uploadResults = await Promise.all(imageFiles.map(file => uploadImage(file.buffer, "packages")));
        newUrls = uploadResults.map(r => r.secure_url);
        newPublicIds = uploadResults.map(r => r.public_id);
      }

      const allImages = [...keptUrls, ...newUrls];
      const allPublicIds = [...keptPublicIds, ...newPublicIds];

      pkg.images = allImages;
      pkg.imagePublicIds = allPublicIds;
      pkg.image = allImages[0] || pkg.image;
      pkg.imagePublicId = allPublicIds[0] || pkg.imagePublicId;
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

export const reorderPackages = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ status: "fail", message: "ids array is required" });
    }
    await Promise.all(
      ids.map((id: string, index: number) =>
        Package.findByIdAndUpdate(id, { displayOrder: index })
      )
    );
    res.status(200).json({
      status: "success",
      message: "Packages reordered successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to reorder packages",
    });
  }
};
