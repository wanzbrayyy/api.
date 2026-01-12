import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user.js";
import { uploadToR2 } from "../services/r2Service.js";
import { translateObject } from "../services/translationService.js";

const renderWithLang = async (res: Response, view: string, data: any, lang: string, textData: any) => {
    const t = await translateObject(textData, lang);
    res.render(view, { ...data, t });
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    const lang = req.lang || 'en';
    
    await renderWithLang(res, "dashboard", { user }, lang, {
        page_title: "Dashboard",
        welcome: "Hello",
        welcome_sub: "Welcome back!",
        system: "System Status",
        online: "Online (API Only)",
        interactive: "Interactive Zone",
        visualize: "Visualize space (Client-Side)",
        content_title: "Dashboard Content",
        content_desc: "Your API services are running smoothly on Vercel Node.js environment."
    });
  } catch (error) { res.redirect("/login"); }
};

export const getBars = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.userId);
      const lang = req.lang || 'en';

      await renderWithLang(res, "bars", { user }, lang, {
          page_title: "Tools & Features",
          hero_title: "Explore Tools",
          hero_desc: "Select a tool to start searching & stalking.",
          tool_github: "Github Stalk",
          tool_pinterest: "Pinterest Search",
          tool_ml: "ML Stalk",
          tool_ff: "FF Stalk",
          tool_genshin: "Genshin Info",
          tool_pubg: "PUBG Stalk",
          tool_ig: "IG Stalk",
          tool_checkch: "Check ID Channel"
      });
    } catch (error) { res.redirect("/login"); }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    const lang = req.lang || 'en';
    
    await renderWithLang(res, "profile", { user }, lang, {
        page_title: "My Profile",
        member_badge: "Member",
        apikey_label: "Your API Key",
        btn_generate: "Generate API Key",
        btn_regenerate: "Regenerate API Key",
        note: "Use this key to access scraping endpoints. Keep it secret!",
        edit_title: "Edit Profile",
        label_name: "Display Name",
        label_avatar: "Update Avatar",
        btn_save: "Save Changes",
        no_key: "No API Key Generated"
    });
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
    } catch (error) { res.redirect("/profile"); }
};