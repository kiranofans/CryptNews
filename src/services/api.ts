import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cryptocurrency.cv',
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
    return articles
      .filter((a: any) => {
        const textToCheck = `${a.source || ''} ${a.title || ''} ${a.category || ''}`.toLowerCase();
        return !textToCheck.includes('feds') && 
               !textToCheck.includes('federal') &&
               !textToCheck.includes('fca') && 
               !textToCheck.includes('uk finance');
      })
      .map(mapArticleToNewsItem);
  } catch (err) {
    console.error('fetchNews error:', err);
    return [];
  }
};

export const fetchPrices = async (coins: string[], fiats: string[]) => {
  // Keep using CryptoCompare for prices for now as it usually has higher limits for public price APIs
  // than for news. If this fails, we can switch to cryptocurrency.cv/api/market
  try {
    const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins.join(',')}&tsyms=${fiats.join(',')}`);
    return response.data;
  } catch (err) {
    console.error('fetchPrices error:', err);
    return {};
  }
};

export const fetchNewsByCoin = async (coin: string, _lang: string = 'EN') => {
  try {
    const response = await api.get(`/api/search?q=${coin}`);
    const articles = response.data.articles || [];
    return articles
      .filter((a: any) => {
        const textToCheck = `${a.source || ''} ${a.title || ''} ${a.category || ''}`.toLowerCase();
        return !textToCheck.includes('feds') && 
               !textToCheck.includes('federal') &&
               !textToCheck.includes('fca') && 
               !textToCheck.includes('uk finance');
      })
      .map(mapArticleToNewsItem);
  } catch (err) {
    console.error('fetchNewsByCoin error:', err);
    return [];
  }
};

export default api;
