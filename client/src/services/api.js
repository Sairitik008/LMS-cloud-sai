import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
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

// Add a response interceptor to handle global errors and cold-start recovery
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Render cold-start absorber: If backend is waking up (502, 503, 504 or Network Error), retry once after a brief delay
    if (
      originalRequest &&
      !originalRequest._isRetry &&
      (error.message === 'Network Error' || [502, 503, 504].includes(error.response?.status))
    ) {
      originalRequest._isRetry = true;
      console.warn('Backend container may be waking from cold sleep. Retrying request in 2.5s...');
      await new Promise((resolve) => setTimeout(resolve, 2500));
      return api(originalRequest);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userInfo');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
