let userList = [
  {
    id: 1,
    username: "Anna",
    room: "Room 1",
  },
  {
    id: 2,
    username: "Hannah",
    room: "Room 2",
  },
  {
    id: 3,
    username: "Tommy",
    room: "Room 1",
  },
  {
    id: 4,
    username: "Hannes",
    room: "Room 3",
  },
];
const getUserList = (room) => {
  return userList.filter((user) => user.room === room);
};
const addUser = (newUser) => {
  userList = [...userList, newUser];
  return userList;
};
const removeUser = (id) => {
  userList = userList.filter((user) => user.id !== id);
  return userList;
};
module.exports = { getUserList, addUser, removeUser };
