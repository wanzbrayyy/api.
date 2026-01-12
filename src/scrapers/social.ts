import axios from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export const stalkGithub = async (username: string) => {
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
};

export const stalkGenshin = async () => {
    const { data } = await axios.get('https://genshin.gg/characters/');
    const $ = cheerio.load(data);
    const characters: any[] = [];
    $('a[href^="/characters/"]').each((i, el) => {
        const name = $(el).find('.character-name').text();
        const link = $(el).attr('href');
        const icon = $(el).find('img').attr('src');
        if (name && link) characters.push({ name, url: `https://genshin.gg${link}`, icon });
    });
    return [...new Map(characters.map(item => [item['name'], item])).values()];
};

export const searchPinterest = async (query: string) => {
    const url = `https://www.bing.com/images/search?q=site%3Apinterest.com+${encodeURIComponent(query)}&first=1&count=20`;
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const results: any[] = [];
    $('a.iusc').each((i, el) => {
        const m = $(el).attr('m');
        if (m) {
            const meta = JSON.parse(m);
            if (meta.purl) results.push({ title: meta.t, image: meta.murl, link: meta.purl });
        }
    });
    return results;
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

export const stalkIG = async (username: string) => {.
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
        await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'domcontentloaded' });
        const data = await page.evaluate(() => {
            const getMeta = (prop: string) => document.querySelector(`meta[property="${prop}"]`)?.getAttribute('content');
            return {
                title: document.title,
                description: getMeta('og:description'),
                image: getMeta('og:image'),
                url: getMeta('og:url')
            };
        });
        await browser.close();
        return data;
    } catch (error) {
        await browser.close();
        return { error: "Failed to scrape IG" };
    }
};