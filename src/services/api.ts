import axios from 'axios';

const api = axios.create({
  baseURL: 'https://min-api.cryptocompare.com/data',
  timeout: 10000,
});

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

export const fetchNews = async (lang: string = 'EN') => {
  const response = await api.get(`/v2/news/?lang=${lang}`);
  return response.data.Data;
};

export const fetchPrices = async (coins: string[], fiats: string[]) => {
  const response = await api.get(`/pricemulti?fsyms=${coins.join(',')}&tsyms=${fiats.join(',')}`);
  return response.data;
};

export const fetchNewsByCoin = async (coin: string, lang: string = 'EN') => {
  const response = await api.get(`/v2/news/?categories=${coin}&lang=${lang}`);
  return response.data.Data;
};

export default api;
