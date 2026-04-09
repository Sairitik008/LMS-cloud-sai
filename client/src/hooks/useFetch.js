import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, method = 'get', body = null, headers = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        url,
        method,
        data: body,
        headers,
      });

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      
      // Don't toast for "not found" on initial loads as it's handled by EmptyState
      if (err.response?.status !== 404) {
        toast.error(message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchData };
};

export default useFetch;
