import { Request, Response } from "express";
import * as Games from "../scrapers/games.js";
import * as Social from "../scrapers/social.js";
import User from "../models/user.js";

export const apiFF = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const result = await Games.stalkFF(id);
        res.json({ status: true, data: result });
    } catch (e) { res.status(500).json({ status: false, message: "Error fetching data" }); }
};

export const apiML = async (req: Request, res: Response) => {
    try {
        const { id, zone } = req.body;
        const result = await Games.stalkML(id, zone);
        res.json({ status: true, data: result });
    } catch (e) { res.status(500).json({ status: false, message: "Error fetching data" }); }
};

export const apiPUBG = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const result = await Games.stalkPUBG(username);
        res.json({ status: true, data: result });
    } catch (e) { res.status(500).json({ status: false, message: "Error fetching data" }); }
};

export const apiGithub = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;
        const result = await Social.stalkGithub(String(username));
        res.json({ status: true, data: result });
    } catch (e) { res.status(500).json({ status: false, message: "User not found" }); }
};

export const apiGenshin = async (req: Request, res: Response) => {
    try {
        const result = await Social.stalkGenshin();
        res.json({ status: true, data: result });
    } catch (e) { res.status(500).json({ status: false, message: "Error" }); }
};

export const apiPinterest = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        const result = await Social.searchPinterest(String(query));
        res.json({ status: true, data: result });
    } catch (e) { res.status(500).json({ status: false, message: "Error" }); }
};

export const apiIg = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;
        const result = await Social.stalkIG(String(username));
        res.json({ status: true, data: result });
    } catch (e) { res.status(500).json({ status: false, message: "Error" }); }
};

export const apiCheckCh = async (req: Request, res: Response) => {
    try {
        const { url } = req.query;
        const result = await Social.checkIdCh(String(url));
        res.json({ status: true, data: result });
    } catch (e) { res.status(500).json({ status: false, message: "Error" }); }
};

const renderTool = async (req: Request, res: Response, viewName: string, title: string) => {
    try {
        const user = await User.findById(req.user?.userId);
        res.render(`tools/${viewName}`, { user, title });
    } catch (e) { res.redirect("/login"); }
};

export const viewFF = (req: Request, res: Response) => renderTool(req, res, "ff", "Free Fire Stalk");
export const viewML = (req: Request, res: Response) => renderTool(req, res, "ml", "Mobile Legends Stalk");
export const viewPUBG = (req: Request, res: Response) => renderTool(req, res, "pubg", "PUBG Stalk");
export const viewGithub = (req: Request, res: Response) => renderTool(req, res, "github", "Github Stalk");
export const viewGenshin = (req: Request, res: Response) => renderTool(req, res, "genshin", "Genshin Characters");
export const viewPinterest = (req: Request, res: Response) => renderTool(req, res, "pinterest", "Pinterest Search");
export const viewIG = (req: Request, res: Response) => renderTool(req, res, "ig", "Instagram Stalk");
export const viewCheckCh = (req: Request, res: Response) => renderTool(req, res, "checkch", "Cek ID WA Channel");