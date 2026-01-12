import axios from 'axios';

const translationCache = new Map<string, string>();

export const languages = [
  { code: 'id', name: 'Indonesian', icon: 'fa-flag', color: '#ef4444' },
  { code: 'en', name: 'English', icon: 'fa-flag-usa', color: '#3b82f6' },
  { code: 'es', name: 'Spanish', icon: 'fa-flag', color: '#f59e0b' },
  { code: 'ja', name: 'Japanese', icon: 'fa-circle', color: '#ef4444' },
  { code: 'fr', name: 'French', icon: 'fa-flag', color: '#3b82f6' },
  { code: 'de', name: 'German', icon: 'fa-flag', color: '#eab308' },
  { code: 'ru', name: 'Russian', icon: 'fa-flag', color: '#ef4444' },
  { code: 'zh-cn', name: 'Chinese', icon: 'fa-star', color: '#ef4444' },
  { code: 'ko', name: 'Korean', icon: 'fa-circle', color: '#3b82f6' },
  { code: 'ar', name: 'Arabic', icon: 'fa-moon', color: '#22c55e' },
  { code: 'ms', name: 'Malay', icon: 'fa-moon', color: '#eab308' }
];

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text) return '';
  if (targetLang === 'en') return text; 

  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey) || text;

  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodedText}`;
    
    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });

    if (response.data && response.data[0]) {
      const result = response.data[0].map((item: any) => item[0]).join('');
      translationCache.set(cacheKey, result);
      return result;
    }
    return text;
  } catch (error) {
    return text;
  }
}

export async function translateObject(obj: any, lang: string): Promise<any> {
    if (typeof obj === 'string') return translateText(obj, lang);
    if (Array.isArray(obj)) return Promise.all(obj.map(item => translateObject(item, lang)));
    if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        const keys = Object.keys(obj);
        await Promise.all(keys.map(async (key) => {
            result[key] = await translateObject(obj[key], lang);
        }));
        return result;
    }
    return obj;
}