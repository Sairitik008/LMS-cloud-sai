import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 45000, // 45s timeout to handle Render free-tier cold-start wakeups without hanging forever
});

// Add a request interceptor to add the auth token & manage headers
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    // When sending FormData, let browser/axios generate multipart boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

import toast from 'react-hot-toast';

// Add a response interceptor to handle global errors and cold-start recovery
api.interceptors.response.use(
  (response) => {
    // Dismiss any active cold-start toast upon successful response
    toast.dismiss('cold-start-wakeup');
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Render cold-start absorber: If backend is waking up (502, 503, 504, 524, or Network Error), retry with informative UI feedback
    if (
      originalRequest &&
      !originalRequest._isRetry &&
      (error.message === 'Network Error' || [502, 503, 504, 524].includes(error.response?.status))
    ) {
      originalRequest._isRetry = true;
      
      // Notify student politely so they know the server is waking from cold sleep
      toast.loading('⚡ Connecting to cloud server (waking up instance)... Please wait ~15s', {
        id: 'cold-start-wakeup',
        duration: 20000,
      });

      console.warn('Backend container waking from cold sleep. Retrying request in 3s...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return api(originalRequest);
    }

    // Dismiss waking toast if final error occurred
    toast.dismiss('cold-start-wakeup');

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
  }
);

/**
 * Pre-warm the backend on initial client load so it's warm by the time the user interacts
 */
export const warmupServer = () => {
  // Fire-and-forget background ping; ignore errors
  api.get('/health').catch(() => {});
};

export default api;
