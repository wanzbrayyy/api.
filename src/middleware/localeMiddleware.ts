import { Request, Response, NextFunction } from "express";
import geoip from "geoip-lite";
import requestIp from "request-ip";
import { languages, translateObject } from "../services/translationService.js";

const countryToLang: { [key: string]: string } = {
  'ID': 'id', 'US': 'en', 'GB': 'en', 'ES': 'es', 
  'JP': 'ja', 'FR': 'fr', 'DE': 'de', 'RU': 'ru', 
  'CN': 'zh-cn', 'KR': 'ko', 'MY': 'ms', 'SG': 'en'
};
const globalTexts = {
    meta_title_suffix: "PartyAPI - Ultimate Tools",
    nav_dashboard: "Dashboard",
    nav_bars: "Bars",
    nav_profile: "Profile",
    nav_logout: "Logout",
    nav_login: "Login",
    nav_join: "Join",
    select_lang: "Select Language",
    select_lang_desc: "Choose your preferred region & language."
};

export const detectLanguage = async (req: Request, res: Response, next: NextFunction) => {
  const urlParts = req.url.split('/');
  const firstPath = urlParts[1]; 
  const supportedLangs = languages.map(l => l.code);
  if (supportedLangs.includes(firstPath)) {
    req.lang = firstPath;
    res.locals.currentLang = firstPath;
    res.locals.langList = languages;
    res.locals.link = (path: string) => `/${firstPath}${path.startsWith('/') ? path : '/' + path}`;

    res.locals.global = await translateObject(globalTexts, firstPath);
    
    return next();
  }
  if (req.url === '/' || !supportedLangs.includes(firstPath)) {
    const clientIp = requestIp.getClientIp(req) || '127.0.0.1';
    const geo = geoip.lookup(clientIp);
    
    let targetLang = 'en'; 
    if (geo && geo.country && countryToLang[geo.country]) {
        targetLang = countryToLang[geo.country];
    } else if (req.headers["accept-language"]) {
        const browserLang = req.headers["accept-language"].split(',')[0].slice(0, 2);
        if (supportedLangs.includes(browserLang)) targetLang = browserLang;
    }

    return res.redirect(`/${targetLang}${req.url === '/' ? '/dashboard' : req.url}`);
  }

  next();
};

declare global {
  namespace Express {
    interface Request { lang?: string; }
  }
}