import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user.js";
import { uploadToR2 } from "../services/r2Service.js";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    res.render("dashboard", { user });
  } catch (error) { res.redirect("/login"); }
};

export const getBars = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.userId);
      res.render("bars", { user });
    } catch (error) { res.redirect("/login"); }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    res.render("profile", { user });
  } catch (error) { res.redirect("/dashboard"); }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;
    let avatarUrl;

    if (req.file) avatarUrl = await uploadToR2(req.file);

    const updateData: any = { name };
    if (avatarUrl) updateData.avatar = avatarUrl;

    await User.findByIdAndUpdate(userId, updateData);
    res.redirect("/profile");
  } catch (error) { res.redirect("/profile"); }
};

export const generateApiKey = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const randomString = crypto.randomBytes(8).toString('hex');
        const newApiKey = `wanz-${randomString}`;

        await User.findByIdAndUpdate(userId, { apiKey: newApiKey });
        res.redirect("/profile");
    } catch (error) {
        res.redirect("/profile");
    }
};