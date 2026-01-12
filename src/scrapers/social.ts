import axios from 'axios';
import * as cheerio from 'cheerio';

export const stalkGithub = async (username: string) => {
    try {
        const { data } = await axios.get(`https://api.github.com/users/${username}`);
        return {
            username: data.login,
            nickname: data.name,
            bio: data.bio,
            avatar: data.avatar_url,
            url: data.html_url,
            followers: data.followers,
            following: data.following,
            repos: data.public_repos,
            location: data.location
        };
    } catch (e) {
        return { error: "User not found" };
    }
};

export const stalkGenshin = async () => {
    try {
        const { data } = await axios.get('https://genshin.gg/characters/');
        const $ = cheerio.load(data);
        const characters: any[] = [];
        $('a[href^="/characters/"]').each((i, el) => {
            const name = $(el).find('.character-name').text();
            const link = $(el).attr('href');
            const icon = $(el).find('img').attr('src');
            if (name && link) {
                characters.push({ name, url: `https://genshin.gg${link}`, icon });
            }
        });
        return [...new Map(characters.map(item => [item['name'], item])).values()];
    } catch (e) {
        return [];
    }
};

export const searchPinterest = async (query: string) => {
    try {
        const url = `https://www.bing.com/images/search?q=site%3Apinterest.com+${encodeURIComponent(query)}&first=1&count=20`;
        const { data } = await axios.get(url, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } 
        });
        const $ = cheerio.load(data);
        const results: any[] = [];
        $('a.iusc').each((i, el) => {
            const m = $(el).attr('m');
            if (m) {
                const meta = JSON.parse(m);
                if (meta.purl) {
                    results.push({ title: meta.t, image: meta.murl, link: meta.purl });
                }
            }
        });
        return results;
    } catch (e) {
        return [];
    }
};

export const checkIdCh = async (url: string) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const title = $('title').text().replace(' | WhatsApp Channel', '');
        const image = $('meta[property="og:image"]').attr('content');
        return { title, image, url };
    } catch (e) {
        return { error: "Invalid Channel Link" };
    }
};

export const stalkIG = async (username: string) => {
    try {
        const { data } = await axios.get(`https://www.instagram.com/${username}/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });
        const $ = cheerio.load(data);
        const getMeta = (prop: string) => $(`meta[property="${prop}"]`).attr('content');
        
        return {
            title: $('title').text(),
            description: getMeta('og:description'),
            image: getMeta('og:image'),
            url: getMeta('og:url')
        };
    } catch (error) {
        return { error: "Failed to scrape IG (Protected/Login Page)" };
    }
};