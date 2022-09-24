const express = require("express");
const app = express();
const path = require("path");
const { createServer } = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const filter = new Filter();

//setup static file
const pathPublic = path.join(__dirname, "../public");
app.use(express.static(pathPublic));

//create server
const httpServer = createServer(app);
const io = socketio(httpServer);

//listen event sent from clients / lang nghe su kien ket noi tu client
io.on("connection", (socket) => {
  console.log("a new client connection");
  //handle message connect
  socket.emit(
    "send a welcome message to the client from the server",
    "welcome to our service"
  );
  socket.broadcast.emit(
    "send a welcome message to the client from the server",
    "There is a new client joining the chat group"
  );

  //chat
  socket.on(
    "send a message from the client to the server",
    (messageText, callback) => {
      //check inproper message
      if (filter.isProfane(messageText)) {
        return callback("The message contains profanities");
      }
      //send message back to all clients
      io.emit("send message back to all clients", messageText);
      //call acknowledgement function
      callback();
    }
  );
  //disconnect server
  socket.on("disconnect", () => console.log("client disconnected"));
});

const PORT = 4567;
httpServer.listen(PORT, () => console.log("listening on port " + PORT));
