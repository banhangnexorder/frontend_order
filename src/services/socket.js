import { io } from "socket.io-client";

export const socket = io("http://backend-order-dev.up.railway.app", {
  transports: ["websocket"],
});
