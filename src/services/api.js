import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

/* 🔥 AUTO GẮN TOKEN */
api.interceptors.request.use((config) => {
  const url = config.url || "";

  const adminToken = localStorage.getItem("admin_token");
  const qrToken = localStorage.getItem("qr_token");

  /* ===== ADMIN APIs ===== */
  if (
    url.includes("/admin") ||
    url.includes("/orders/") // 👈 có id => admin/staff
  ) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  }

  /* ===== QR APIs ===== */
  if (
    url === "/orders" ||        // 👈 create order
    url.includes("/menu")
  ) {
    if (qrToken) {
      config.headers["x-qr-token"] = qrToken;
    }
  }

  return config;
});

