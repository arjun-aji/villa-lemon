import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

// Sign JWT token helper
const signToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "defaultsupersecretkey",
    {
      expiresIn: (process.env.JWT_EXPIRES_IN as any) || "90d",
    }
  );
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    // Find user and select password (since it is hidden by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    // Generate JWT token
    const token = signToken(user._id.toString());

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error during login",
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    // req.user was attached by protect middleware
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch user data",
    });
  }
};
