const socket = io();

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
  socket.emit("send message from client to server", message, acknowledgement);
  socket.on("send message back to all clients", (messageText) => {
    console.log("receive message", messageText);
  });
});
