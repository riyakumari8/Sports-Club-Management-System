import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    // If the backend returns ApiResponse wrapper
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    toast.error(errorMsg);
    return Promise.reject(error);
  }
);

export default api;
