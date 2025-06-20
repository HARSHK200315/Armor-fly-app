module.exports = function(io) {
  io.on("connection", (socket) => {
    socket.on("joinPod", ({ podId }) => {
      socket.join(podId);
    });

    socket.on("sendMessage", ({ podId, message }) => {
      io.to(podId).emit("receiveMessage", message);
    });
  });
};
