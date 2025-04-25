import { useState, useCallback } from 'react';
import api from '../services/api';

const useApi = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (
    method,
    url,
    data = null,
    options = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(url, { ...options });
          break;
        case 'post':
          response = await api.post(url, data, { ...options });
          break;
        case 'put':
          response = await api.put(url, data, { ...options });
          break;
        case 'delete':
          response = await api.delete(url, { ...options });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const get = useCallback((url, options) => request('get', url, null, options), [request]);
  const post = useCallback((url, data, options) => request('post', url, data, options), [request]);
  const put = useCallback((url, data, options) => request('put', url, data, options), [request]);
  const del = useCallback((url, options) => request('delete', url, null, options), [request]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    data,
    request,
    get,
    post,
    put,
    delete: del,
    reset
  };
};

export default useApi;