import { io } from "socket.io-client";

export const socket = io("https://mucchatlu-backend.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"]
});
