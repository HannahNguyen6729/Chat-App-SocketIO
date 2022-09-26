const socket = io();

//handle message connect
socket.on("send a welcome message to the client from the server", (message) => {
  console.log("welcome message: ", message);
});

//chat
document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("input-messages").value;

  //console.log(message);
  const acknowledgement = (error) => {
    if (error) {
      alert(
        "please write the message again because the message includes profanities"
      );
    }
    console.log("message was sent successfully ");
  };
  socket.emit(
    "send a message from the client to the server",
    message,
    acknowledgement
  );
});
socket.on("send message back to all clients", (messageText) => {
  console.log("receive message", messageText);
});

//sharing location
document.getElementById("btn-share-location").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const location = { latitude, longitude };
      socket.emit("send location from client to server", location);
    });
  }
});
socket.on("share location from server to client", (linkLocation) => {
  console.log("linkLocation", linkLocation);
});

//handle query string parameters
const queryString = location.search;
//console.log(queryString); //   ?room=js&username=anna
const paramObj = Qs.parse(queryString, { ignoreQueryPrefix: true });
//console.log("paramObj", paramObj);
const { room, username } = paramObj;
socket.emit("join in the room action from client to server", {
  room,
  username,
});

//handle userList
socket.on("send userList from server to client", (userList) => {
  console.log("userList", userList);
});
