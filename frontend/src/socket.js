import { io } from "socket.io-client";

// 👇 If your backend is running locally:
export const socket = io("https://armor-fly-app.onrender.com");
