import axios from "axios";

const api = axios.create({
  baseURL: "https://mucchatlu.onrender.com/api",
});

// ===============================
// 🔐 AUTO ATTACH TOKEN
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { api };
export default api;
