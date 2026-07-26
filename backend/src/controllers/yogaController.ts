import { Request, Response } from "express";
import { YogaProgram, Teacher } from "../models/Yoga";
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

// YOGA PROGRAMS CRUD
export const getAllYogaPrograms = async (req: Request, res: Response): Promise<any> => {
  try {
    const filter: any = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const programs = await YogaProgram.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: programs.length,
      data: programs,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch yoga programs",
    });
  }
};

export const createYogaProgram = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type, href } = req.body;
    
    const title = parseField(req.body.title);
    const description = parseField(req.body.description);
    const explore = parseField(req.body.explore);

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "An image file is required for creating a yoga program",
      });
    }

    // Upload image to Cloudinary folder 'yoga'
    const uploadResult = await uploadImage(req.file.buffer, "yoga");

    const newProgram = new YogaProgram({
      type,
      title,
      description,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      explore,
      href: href || "#contact",
    });

    await newProgram.save();

    res.status(201).json({
      status: "success",
      data: newProgram,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create yoga program",
    });
  }
};

export const updateYogaProgram = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const program = await YogaProgram.findById(id);

    if (!program) {
      return res.status(404).json({
        status: "fail",
        message: "Yoga program not found",
      });
    }

    if (req.body.type) program.type = req.body.type;
    if (req.body.href) program.href = req.body.href;
    if (req.body.title) program.title = { ...program.title, ...parseField(req.body.title) };
    if (req.body.description) program.description = { ...program.description, ...parseField(req.body.description) };
    if (req.body.explore) program.explore = { ...program.explore, ...parseField(req.body.explore) };

    if (req.file) {
      // Delete old from Cloudinary
      if (program.imagePublicId) {
        await deleteImage(program.imagePublicId).catch(err => {
          console.warn(`[cloudinary]: Image delete failed: ${err.message}`);
        });
      }

      // Upload new image
      const uploadResult = await uploadImage(req.file.buffer, "yoga");
      program.image = uploadResult.secure_url;
      program.imagePublicId = uploadResult.public_id;
    }

    await program.save();

    res.status(200).json({
      status: "success",
      data: program,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update yoga program",
    });
  }
};

export const deleteYogaProgram = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const program = await YogaProgram.findById(id);

    if (!program) {
      return res.status(404).json({
        status: "fail",
        message: "Yoga program not found",
      });
    }

    // Delete image from Cloudinary
    if (program.imagePublicId) {
      await deleteImage(program.imagePublicId).catch(err => {
        console.warn(`[cloudinary]: Image delete failed: ${err.message}`);
      });
    }

    await YogaProgram.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Yoga program deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to delete yoga program",
    });
  }
};

// TEACHERS CRUD
export const getAllTeachers = async (req: Request, res: Response): Promise<any> => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: teachers.length,
      data: teachers,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch teachers",
    });
  }
};

export const createTeacher = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body;
    
    const role = parseField(req.body.role);
    const bio = parseField(req.body.bio);

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "An image file is required for creating a teacher profile",
      });
    }

    // Upload image to Cloudinary folder 'yoga'
    const uploadResult = await uploadImage(req.file.buffer, "yoga");

    const newTeacher = new Teacher({
      name,
      role,
      bio,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });

    await newTeacher.save();

    res.status(201).json({
      status: "success",
      data: newTeacher,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create teacher profile",
    });
  }
};

export const updateTeacher = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        status: "fail",
        message: "Teacher profile not found",
      });
    }

    if (req.body.name) teacher.name = req.body.name;
    if (req.body.role) teacher.role = { ...teacher.role, ...parseField(req.body.role) };
    if (req.body.bio) teacher.bio = { ...teacher.bio, ...parseField(req.body.bio) };

    if (req.file) {
      // Delete old from Cloudinary
      if (teacher.imagePublicId) {
        await deleteImage(teacher.imagePublicId).catch(err => {
          console.warn(`[cloudinary]: Image delete failed: ${err.message}`);
        });
      }

      // Upload new image
      const uploadResult = await uploadImage(req.file.buffer, "yoga");
      teacher.image = uploadResult.secure_url;
      teacher.imagePublicId = uploadResult.public_id;
    }

    await teacher.save();

    res.status(200).json({
      status: "success",
      data: teacher,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update teacher profile",
    });
  }
};

export const deleteTeacher = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        status: "fail",
        message: "Teacher profile not found",
      });
    }

    // Delete image from Cloudinary
    if (teacher.imagePublicId) {
      await deleteImage(teacher.imagePublicId).catch(err => {
        console.warn(`[cloudinary]: Image delete failed: ${err.message}`);
      });
    }

    await Teacher.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Teacher profile deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to delete teacher profile",
    });
  }
};
