import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { CONSTANTS } from "../config/constants.js";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, CONSTANTS.JWT_SECRET) as { userId: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect("/login");
  }
};

export const redirectIfAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, CONSTANTS.JWT_SECRET);
      return res.redirect("/dashboard");
    } catch (error) { return next(); }
  }
  next();
};

export const requireApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.query.apikey || req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ 
            status: false, 
            code: 401, 
            message: "API Key is missing. Please generate one in your profile." 
        });
    }

    try {
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(403).json({ 
                status: false, 
                code: 403, 
                message: "Invalid API Key." 
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ status: false, code: 500, message: "Internal Server Error" });
    }
};