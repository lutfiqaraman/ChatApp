const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

io.on("connection", (socket) => {
    console.log("New WebSocket Connection");

    socket.broadcast.emit("message", "A new user has joined !");

    socket.on("sendMsg", (message, callback) => {
        io.emit("message", message);
        callback("Delivered");
    });

    socket.on("sendLocation", (coords, callback) => {
        io.emit("message", `https://google.com/maps?q=${coords.lat},${coords.lang}`);
        callback();
    });

    socket.on("disconnect", () => {
        io.emit("message", "a user has left");
    });

});

server.listen(port, () => {
    console.log("Server is up on port " + port);
});