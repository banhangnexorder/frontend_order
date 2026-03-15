// src/services/socket.js

import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ SOCKET DISCONNECTED");
});

socket.on("connect_error", (err) => {
  console.error("SOCKET ERROR:", err);
});