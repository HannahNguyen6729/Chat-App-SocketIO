const express = require("express");
const app = express();
const path = require("path");
const { createServer } = require("http");
const socketio = require("socket.io");

//setup static file
const pathPublic = path.join(__dirname, "../public");
app.use(express.static(pathPublic));

//create server
const httpServer = createServer(app);
const io = socketio(httpServer);
let count = 1;
const messages = "hello world";

//listen event sent from clients / lang nghe su kien ket noi tu client
io.on("connection", (socket) => {
  console.log("new client connection");

  // listen on server the event sent from client
  socket.on("click button to increase count", () => {
    count++;
    console.log("count is increased to: " + count);
    //transfer count value from server to client
    io.emit("send count value from server to client", count);
  });

  //transfer count value from server to client
  //socket.emit("send messages to client", messages);

  //disconnect server
  socket.on("disconnect", () => console.log("client disconnected"));
});

const PORT = 4567;
httpServer.listen(PORT, () => console.log("listening on port " + PORT));
