import { Request, Response, NextFunction } from "express";
import geoip from "geoip-lite";
import requestIp from "request-ip";
import { languages } from "../services/translationService.js";
const countryToLang: { [key: string]: string } = {
  'ID': 'id', 'US': 'en', 'GB': 'en', 'ES': 'es', 
  'JP': 'ja', 'FR': 'fr', 'DE': 'de', 'RU': 'ru', 
  'CN': 'zh-cn', 'KR': 'ko', 'MY': 'ms', 'SG': 'en'
};

export const detectLanguage = (req: Request, res: Response, next: NextFunction) => {
  const urlParts = req.url.split('/');
  const firstPath = urlParts[1];
  const supportedLangs = languages.map(l => l.code);
  if (supportedLangs.includes(firstPath)) {
    req.lang = firstPath;
    res.locals.currentLang = firstPath;
    res.locals.langList = languages;
    res.locals.link = (path: string) => `/${firstPath}${path.startsWith('/') ? path : '/' + path}`;
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
    interface Request {
      lang?: string;
    }
  }
}