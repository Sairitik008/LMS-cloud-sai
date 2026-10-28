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

    // Render cold-start & cooling-period absorber:
    // If backend is waking up (502, 503, 504, 524, ECONNABORTED, or Network Error),
    // progressively retry up to 3 times over 20-30s with informative UI feedback
    const isColdStartError =
      error.message === 'Network Error' ||
      error.code === 'ECONNABORTED' ||
      Boolean(error.message && error.message.includes('timeout')) ||
      [502, 503, 504, 524].includes(error.response?.status);

    const MAX_RETRIES = 3;
    const currentRetry = originalRequest?._retryCount || 0;

    if (originalRequest && isColdStartError && currentRetry < MAX_RETRIES) {
      originalRequest._retryCount = currentRetry + 1;

      const delays = [3000, 5000, 8000];
      const retryAfterHeader = error.response?.headers?.['retry-after'];
      const retryAfterSec = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null;
      const delayMs = retryAfterSec && Number.isFinite(retryAfterSec) && retryAfterSec > 0
        ? retryAfterSec * 1000
        : (delays[currentRetry] || 5000);

      // Only show user-facing toast if not a silent background request (e.g. warmupServer)
      if (!originalRequest.silent && !originalRequest.skipColdStartToast) {
        toast.loading(
          `⚡ Connecting to cloud server (waking up instance... attempt ${currentRetry + 1}/${MAX_RETRIES}). Please wait ~${Math.round(delayMs / 1000)}s`,
          {
            id: 'cold-start-wakeup',
            duration: 25000,
          }
        );
      }

      console.warn(`[UPTIME] Server waking from cooling period. Attempt ${currentRetry + 1}/${MAX_RETRIES}. Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return api(originalRequest);
    }

    // Dismiss waking toast if final error occurred
    toast.dismiss('cold-start-wakeup');

    if (error.response && error.response.status === 401 && !originalRequest?.url?.includes('/auth/login')) {
      localStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
  }
);

/**
 * Pre-warm the backend on initial client load so it's warm by the time the user interacts
 */
export const warmupServer = () => {
  // Fire-and-forget background ping; runs silently without displaying blocking user toasts
  api.get('/health', { silent: true, skipColdStartToast: true }).catch(() => {});
};

export default api;
