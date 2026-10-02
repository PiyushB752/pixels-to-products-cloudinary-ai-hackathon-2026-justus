import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.SERVER_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("campusly_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;