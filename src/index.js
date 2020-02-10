const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const msg = require("../utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

io.on("connection", socket => {
  console.log("New WebSocket Connection");

  socket.on("loginInfo", ({ username, chatroom }) => {
    socket.join(chatroom);

    socket.emit("message", msg.generateMsg("Welcome !"));
    socket.broadcast
      .to(chatroom)
      .emit("message", msg.generateMsg(`${username} has joined ... `));
  });

  socket.on("sendMsg", (message, callback) => {
    io.emit("message", msg.generateMsg(message));
    callback("Delivered");
  });

  socket.on("sendLocation", (coords, callback) => {
    const url = `https://google.com/maps?q=${coords.lat},${coords.lang}`;
    io.emit("locationMsg", msg.generateLocationMsg(url));
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", msg.generateMsg("a user has left"));
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
