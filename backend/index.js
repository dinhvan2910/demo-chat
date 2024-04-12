const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const PORT = 4000;

const server = http.createServer(app);

const socketIO = new Server(server);

function createUniqueId() {
  return Math.random().toString(20).substring(2, 10);
}

let chatGroups = [];
let users = [];

socketIO.use((socket, next) => {
  const userName = socket.handshake.auth.currentUserName;
  console.log('userName', userName);
  if (!userName) {
    return next(new Error("invalid userName"));
  }
  socket.userName = userName;
  next();
});

socketIO.on('connection', (socket) => {
  console.log(`${socket.id} user is just connected`);

  for (let [id, socket] of socketIO.of("/").sockets) {
    const user = users.find(x => x.userID === id && x.userName === socket.userName);
    if (!user) {
      users.push({
        userID: id,
        userName: socket.userName,
      });
    }
  }
  socket.emit("users", users);
  console.log('all users', users)

  // notify existing users
  socket.broadcast.emit("userConnected", {
    userID: socket.id,
    userName: socket.userName,
  });

  socket.on('createJoinChat', () => {
    socket.join('createJoinChat');
    socket.emit('groupList', chatGroups);
    socket.emit("users", users);
  });

  socket.on('createNewGroup', (currentGroupName) => {
    chatGroups.unshift({
      id: chatGroups.length + 1,
      currentGroupName,
      messages: []
    });
    console.log('vua tao group', chatGroups);
    socketIO
      .to('createJoinChat')
      .emit("newGroup", chatGroups);
    socket.emit('groupList', chatGroups);
  });

  socket.on("findGroup", (id) => {
    const filteredGroup = chatGroups.filter((item) => item.id === id);
    console.log(`filteredGroup ${socket.id}:`, filteredGroup);

    socket.join(filteredGroup[0].currentGroupName);
    console.log(`User ${socket.id} a join room :` + filteredGroup[0].currentGroupName);

    socket.emit("foundGroup", filteredGroup[0].messages);
  });

  socket.on("privateMessage", ({ content, to }) => {
    console.log('privateMessage content', content);
    console.log('privateMessage to', to);
    const newMessage = {
      id: createUniqueId(),
      text: content.currentChatMesage,
      currentUserName: content.currentUserName,
      time: `${content.timeData.hour}:${content.timeData.minutes}`,
    };
    socket.to(to).emit("privateMessage", {
      newMessage,
      from: socket.id,
    });
  });

  socket.on("newChatMessage", (data) => {
    const { currentChatMesage, groupId, currentUserName, timeData } = data;
    const filteredGroup = chatGroups.filter(
      (item) => item.id === groupId
    );
    console.log('filteredGroup', filteredGroup);
    const newMessage = {
      id: createUniqueId(),
      text: currentChatMesage,
      currentUserName,
      time: `${timeData.hour}:${timeData.minutes}`,
    };

    filteredGroup[0].messages.push(newMessage);
    socketIO
      .to(filteredGroup[0].currentGroupName)
      .emit("newMessage", filteredGroup[0].messages);
    socket.emit("groupList", chatGroups);
    socket.emit("foundGroup", filteredGroup[0].messages);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log(`${socket.id} user is just disconnected`);
  });
});

app.get('/getGroups', (req, res) => {
  res.json(chatGroups);
});

app.get('/getUsers', (req, res) => {
  res.json(users);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});