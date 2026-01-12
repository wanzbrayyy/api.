import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CONSTANTS } from "../config/constants";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

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
    } catch (error) {
      return next();
    }
  }
  next();
};