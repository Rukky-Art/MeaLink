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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is dead! Clear it so the user can log in again
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optional: Force a redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export default api;