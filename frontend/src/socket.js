import { io } from "socket.io-client";

// 👇 If your backend is running locally:
export const socket = io("http://localhost:5000");
