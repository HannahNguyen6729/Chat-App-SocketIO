const socket = io();

//handle message connect
// socket.on("send a welcome message to the client from the server", (message) => {
//   console.log("welcome message: ", message);
// });

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

//chat: receive messages from server
socket.on("send message from the server to clients", (message) => {
  console.log("receive message", message);
  //show message on browser
  let htmlMessage = document.getElementById("app__messages").innerHTML;
  htmlMessage += `
  <div class="message-item">
 			 <div class="message__row1">
              <p class="message__name"> ${message.username} </p>
              <p class="message__date"> ${message.createAt} </p>
            </div>
            <div class="message__row2">
              <p class="message__content">
                ${message.messageText}
              </p>
            </div>
	</div>
		`;
  document.getElementById("app__messages").innerHTML = htmlMessage;
  //clear input message
  document.getElementById("input-messages").value = "";
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
socket.on("share location from server to client", (message) => {
  console.log("linkLocation", message.messageText);
  //show location on browser
  let htmlMessage = document.getElementById("app__messages").innerHTML;
  htmlMessage += `
<div class="message-item">
		   <div class="message__row1">
		   <p class="message__name"> ${message.username} </p>
		   <p class="message__date"> ${message.createAt} </p>
		 </div>
		 <div class="message__row2">
		   <p class="message__content">
			 <a href=${message.messageText} target='_blank'> My location </a>
		   </p>
		 </div>
 </div>
	 `;
  document.getElementById("app__messages").innerHTML = htmlMessage;
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

//show chat room on html file
document.getElementById("app__title").innerHTML = room;

//handle userList
socket.on("send userList from server to client", (userList) => {
  console.log("userList", userList);
  let htmlContent = "";
  userList.map((user) => {
    htmlContent += `<li class="app__item-user"> ${user.username} </li>`;
  });
  document.getElementById("app__list-user--content").innerHTML = htmlContent;
});
