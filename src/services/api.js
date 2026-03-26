import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

/* 🔥 AUTO GẮN TOKEN */
api.interceptors.request.use((config) => {

  const url = config.url || "";

  /* ===== ADMIN ===== */
  if (url.includes("/admin")) {
    const adminToken = localStorage.getItem("admin_token");

    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  }

  /* ===== QR ===== */
  if (url.includes("/menu") || url.includes("/orders")) {
    const qrToken = localStorage.getItem("qr_token");

    if (qrToken) {
      config.headers["x-qr-token"] = qrToken;
    }
  }

  return config;
});