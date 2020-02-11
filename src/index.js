const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const msg = require("../utils/messages");
const users = require("../utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

io.on("connection", socket => {
  console.log("New WebSocket Connection");

  socket.on("loginInfo", ({ username, chatroom }, callback) => {
    const { error, user } = users.addUser({
      id: socket.id,
      username,
      chatroom
    });

    if (error) {
      return callback(error);
    }

    socket.join(user.chatroom);

    socket.emit("message", msg.generateMsg("Admin", "Welcome !"));
    socket.broadcast
      .to(user.chatroom)
      .emit("message", msg.generateMsg("Admin", `${user.username} has joined ... `));

    callback();
  });

  socket.on("sendMsg", (message, callback) => {
    const user = users.getUser(socket.id);
    io.to(user.chatroom).emit("message", msg.generateMsg(user.username, message));

    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = users.getUser(socket.id);
    const url = `https://google.com/maps?q=${coords.lat},${coords.lang}`;

    io.to(user.chatroom).emit("locationMsg", msg.generateLocationMsg(user.username, url));

    callback();
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.chatroom).emit(
        "message",
        msg.generateMsg("Admin", `${user.username} has left ...`)
      );
    }
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
