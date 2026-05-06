import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mealink-uxzq.onrender.com/api/', // Your Django server URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to add Token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;