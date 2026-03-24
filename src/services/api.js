import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

/* 🔥 AUTO GẮN TOKEN */
api.interceptors.request.use((config) => {

  const params = new URLSearchParams(window.location.search);
  const token = params.get("t");

  if (token) {
    config.params = {
      ...config.params,
      t: token
    };
  }

  return config;
});