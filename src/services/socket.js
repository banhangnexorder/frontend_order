import { io } from "socket.io-client";

export const socket = io("https://backend-order-dev.up.railway.app", {
  transports: ["websocket"],
});
