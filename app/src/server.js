const express = require("express");
const app = express();
const path = require("path");
const { createServer } = require("http");
const socketio = require("socket.io");
const { createMessage } = require("./utils/create_chat_message");
const Filter = require("bad-words");
const { getUserList, addUser, removeUser } = require("./utils/usersManagement");
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

  //join in the room
  socket.on(
    "join in the room action from client to server",
    ({ room, username }) => {
      socket.join(room);
      //handle message connect: send message to the new client
      socket.emit(
        "send a welcome message to the client from the server",
        `welcome to our chat room ${room}`
      );
      //socket.broadcast.emit(): sending message to all clients expect the new client
      socket.broadcast
        .to(room)
        .emit(
          "send a welcome message to the client from the server",
          `A client with name:  ${username} just joined in the chat room: ${room}`
        );
      //chat
      socket.on(
        "send a message from the client to the server",
        (messageText, callback) => {
          //check inproper message
          if (filter.isProfane(messageText)) {
            return callback("The message contains profanities");
          }
          const message = createMessage(messageText);
          //send message back to all clients
          io.to(room).emit("send message back to all clients", message);
          //call acknowledgement function
          callback();
        }
      );
      // sharing location
      socket.on("send location from client to server", (location) => {
        console.log("received location: ", location);
        const { latitude, longitude } = location;
        const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
        io.to(room).emit("share location from server to client", linkLocation);
      });
      //handle userList
      const newUser = {
        id: socket.id,
        username,
        room,
      };
      addUser(newUser);
      io.to(room).emit(
        "send userList from server to client",
        getUserList(room)
      );
      //disconnect server
      socket.on("disconnect", () => {
        removeUser(socket.id);
        io.to(room).emit(
          "send userList from server to client",
          getUserList(room)
        );
        console.log("client disconnected");
      });
    }
  );
});

const PORT = 4567;
httpServer.listen(PORT, () => console.log("listening on port " + PORT));
