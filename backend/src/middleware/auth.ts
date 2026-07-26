import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { IUser } from "../types";

// Extend Request interface to support req.user in Express router scope
export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let token: string | undefined;

    // Check for authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in. Please log in to get access.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string };

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in again.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "Your session token has expired. Please log in again.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Authentication failed",
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};
