const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

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
app.use("/api/connection", require("./routes/connectionRoutes"));


// Socket setup
require("./socket/podChat")(io);

server.listen(5000, () => console.log("Server running on 5000"));
