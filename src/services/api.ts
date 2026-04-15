import axios from 'axios';

const isBrowser = typeof window !== 'undefined';
const isDev = import.meta.env.DEV;

// In Astro, server-side code (SSR/SSG) runs in Node.js where relative domains like '/' fail in Axios.
// - Server side: Always use the absolute remote data URL.
// - Client side (dev): Use '/' to engage the Vite proxy to avoid CORS.
// - Client side (prod): Use the absolute remote data URL.
let baseURL = 'https://cryptocurrency.cv';
if (isDev && isBrowser) {
  baseURL = '/';
}

const api = axios.create({
  baseURL,
  timeout: 30000,
});

// Helper to map new API article to old NewsItem format
const mapArticleToNewsItem = (article: any) => {
  // Normalize link: lowercase, trim, remove query params, remove trailing slash
  const normalizedLink = (article.link || '').toLowerCase().trim().split('?')[0].replace(/\/$/, '');

  // Use API id if available, fallback to a safe hash of the link
  const safeId = article.id || normalizedLink.replace(/[^a-z0-9]/gi, '').slice(-16);

  return {
    id: safeId,
    title: article.title,
    imageurl: article.imageUrl,
    body: article.description || '',
    url: article.link,
    source: article.source,
    published_on: Math.floor(new Date(article.pubDate).getTime() / 1000),
    categories: article.category || 'general'
  };
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response for debugging
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Format error response in JSON
    const errorResponse = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    };
    console.error('[API Error]', JSON.stringify(errorResponse, null, 2));
    return Promise.reject(errorResponse);
  }
);

export const fetchNews = async (lang: string = 'EN', page: number = 1) => {
  try {
    const response = await api.get(`/api/news?page=${page}&limit=20`);
    const articles = response.data.articles || [];

    // Distinguish between true empty feed and an empty array due to local filters
    if (articles.length === 0) return null;

    const filterFn = (a: any) => {
      const text = `${a.source || ''} ${a.title || ''} ${a.category || ''}`.toLowerCase();
      return !text.includes('feds') &&
             !text.includes('federal') &&
             !text.includes('fca') &&
             !text.includes('uk finance');
    };
    const filtered = articles.filter(filterFn);
    // Fall back to all articles if filter removes everything
    return (filtered.length > 0 ? filtered : articles).map(mapArticleToNewsItem);
  } catch (err: any) {
    console.error('fetchNews error:', err);
    throw new Error(err.message || 'Failed to fetch news');
  }
};

export const fetchPrices = async (coins: string[], fiats: string[]) => {
  // Keep using CryptoCompare for prices for now as it usually has higher limits for public price APIs
  // than for news. If this fails, we can switch to cryptocurrency.cv/api/market
  try {
    const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins.join(',')}&tsyms=${fiats.join(',')}`);
    return response.data;
  } catch (err: any) {
    console.error('fetchPrices error:', err);
    throw new Error(err.message || 'Failed to fetch prices');
  }
};

export const fetchNewsByCoin = async (coin: string, _lang: string = 'EN') => {
  try {
    const response = await api.get(`/api/search?q=${coin}`);
    const articles = response.data.articles || [];
    const filterFn = (a: any) => {
      const text = `${a.source || ''} ${a.title || ''} ${a.category || ''}`.toLowerCase();
      return !text.includes('feds') &&
             !text.includes('federal') &&
             !text.includes('fca') &&
             !text.includes('uk finance');
    };
    const filtered = articles.filter(filterFn);
    // Fall back to all articles if filter removes everything
    return (filtered.length > 0 ? filtered : articles).map(mapArticleToNewsItem);
  } catch (err: any) {
    console.error('fetchNewsByCoin error:', err);
    throw new Error(err.message || 'Failed to fetch news by coin');
  }
};

export default api;
