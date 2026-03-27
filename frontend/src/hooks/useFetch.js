import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';

/**
 * Hook để fetch data từ API
 * @param {string} url - URL của API
 * @param {object} options - Config options (method, params, headers, etc)
 * @returns {object} { data, loading, error, refetch }
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;
