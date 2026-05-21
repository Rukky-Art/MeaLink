import axios from 'axios';

const api = axios.create({
  // This tells Vite to go look in your .env file for the URL
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
// Interceptor to add Token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;