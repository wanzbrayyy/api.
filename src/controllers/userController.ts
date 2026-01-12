import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user.js";
import { uploadToR2 } from "../services/r2Service.js";
import { translateText } from "../services/translationService.js";

const translateBatch = async (texts: Record<string, string>, lang: string) => {
  const keys = Object.keys(texts);
  const values = Object.values(texts);
  const translatedValues = await Promise.all(values.map(v => translateText(v, lang)));
  const result: Record<string, string> = {};
  keys.forEach((key, index) => result[key] = translatedValues[index]);
  return result;
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    const lang = req.lang || 'en';

    const t = await translateBatch({
      welcome: "Hello",
      welcome_sub: "Welcome back!",
      system: "System Status",
      online: "Online (API Only)",
      interactive: "Interactive Zone",
      visualize: "Visualize space (Client-Side)",
      content_title: "Dashboard Content",
      content_desc: "Your API services are running smoothly on Vercel Node.js environment."
    }, lang);

    res.render("dashboard", { user, t });
  } catch (error) {
    res.redirect("/login");
  }
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
    const lang = req.lang || 'en';
    
    const t = await translateBatch({
        member: "Member",
        apikey_label: "Your API Key",
        btn_generate: "Generate API Key",
        btn_regenerate: "Regenerate API Key",
        note: "Use this key to access scraping endpoints. Keep it secret!",
        edit_title: "Edit Profile",
        btn_save: "Save Changes"
    }, lang);

    res.render("profile", { user, t });
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