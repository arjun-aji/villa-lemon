import { Request, Response } from "express";
import { Homepage } from "../models/Homepage";

export const getHomepage = async (req: Request, res: Response): Promise<any> => {
  try {
    const homepage = await Homepage.findOne();
    if (!homepage) {
      return res.status(444).json({
        status: "fail",
        message: "Homepage content not found in database",
      });
    }

    res.status(200).json({
      status: "success",
      data: homepage,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch homepage data",
    });
  }
};

export const updateHomepage = async (req: Request, res: Response): Promise<any> => {
  try {
    const homepage = await Homepage.findOne();
    if (!homepage) {
      return res.status(404).json({
        status: "fail",
        message: "Homepage document does not exist to update.",
      });
    }

    // Update fields sent in request body
    if (req.body.hero) homepage.hero = { ...homepage.hero, ...req.body.hero };
    if (req.body.highlights) homepage.highlights = { ...homepage.highlights, ...req.body.highlights };
    if (req.body.about) homepage.about = { ...homepage.about, ...req.body.about };
    if (req.body.contact) homepage.contact = { ...homepage.contact, ...req.body.contact };

    await homepage.save();

    res.status(200).json({
      status: "success",
      data: homepage,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update homepage content",
    });
  }
};
