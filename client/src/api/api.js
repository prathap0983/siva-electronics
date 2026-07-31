import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Request interceptor to automatically attach JWT authorization token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired JWT sessions gracefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 410)) {
      // Clear local session if expired
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      
      // Redirect to admin login if they are attempting to use backend admin panels
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin") {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
