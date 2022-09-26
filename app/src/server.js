const express = require("express");
const app = express();
const path = require("path");
const { createServer } = require("http");
const socketio = require("socket.io");
const { createMessage } = require("./utils/create_chat_message");
const Filter = require("bad-words");
const {
  getUserList,
  addUser,
  removeUser,
  findUser,
} = require("./utils/usersManagement");
const { create } = require("domain");
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
        "send message from the server to clients",
        createMessage(`welcome to our chat room ${room}`, "Admin")
      );
      //socket.broadcast.emit(): sending message to all clients expect the new client
      socket.broadcast
        .to(room)
        .emit(
          "send message from the server to clients",
          createMessage(
            `A new client (${username}) just joined in our chat room: ${room}`,
            "Admin"
          )
        );
      //chat
      socket.on(
        "send a message from the client to the server",
        (messageText, callback) => {
          //check improper message
          if (filter.isProfane(messageText)) {
            return callback("The message contains profanities");
          }
          //finding user sending message
          const userId = socket.id;
          const user = findUser(userId);
          const message = createMessage(messageText, user.username);
          //send message back to all clients
          io.to(room).emit("send message from the server to clients", message);
          //call acknowledgement function
          callback();
        }
      );
      // sharing location
      socket.on("send location from client to server", (location) => {
        console.log("received location: ", location);
        const { latitude, longitude } = location;
        const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
        //finding user sending message
        const userId = socket.id;
        const user = findUser(userId);
        const message = createMessage(linkLocation, user.username);
        io.to(room).emit("share location from server to client", message);
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
