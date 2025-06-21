const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");


dotenv.config();
const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" }
// });

app.use(cors());
app.use(express.json());



// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));



// Socket setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Track online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // Register the user as online
  socket.on("registerUser", (anonName) => {
    onlineUsers.set(anonName, socket.id);
    console.log(`✅ ${anonName} is now online`);
  });

  // Join a pod chat room
  socket.on("joinPod", ({ podId }) => {
    socket.join(podId);
    console.log(`👥 Socket joined pod: ${podId}`);
  });

  // Send messages within a pod
  socket.on("sendMessage", ({ podId, message }) => {
    io.to(podId).emit("receiveMessage", message);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let [anon, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(anon);
        console.log(`❌ ${anon} disconnected`);
        break;
      }
    }
  });
});

// Start server
server.listen(5000, () => {
  console.log("Server running on 5000");
});

// Export online users map so routes can use it
module.exports = { io, onlineUsers };

app.use("/api/connection", require("./routes/connectionRoutes"));
