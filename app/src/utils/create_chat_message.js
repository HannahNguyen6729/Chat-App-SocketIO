const formatTime = require("date-format");
const createMessage = (messageText, username) => {
  return {
    username,
    messageText,
    createAt: formatTime("dd-MM-yyyy hh:mm:ss", new Date()),
  };
};
module.exports = { createMessage };
