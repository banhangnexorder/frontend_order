import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

/* 🔥 AUTO GẮN TOKEN */
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin_token");
  const qrToken = localStorage.getItem("qr_token");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  if (qrToken) {
    config.headers["x-qr-token"] = qrToken;
  }

  return config;
});

