import axios from "axios";

const baseURL = 'https://keeptrek-backend.onrender.com/'; // http://localhost:8000/ https://keeptrek-backend.onrender.com/

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Automatically add Authorization header if token exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
