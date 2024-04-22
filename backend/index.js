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
    const userIdx = users.findIndex(x => x.userName === socket.userName);
    console.log('userIdx', userIdx)
    if (userIdx < 0) {
      users.push({
        userID: id,
        userName: socket.userName,
        messages: [],
        connected: true,
      });
    } else {
      users[userIdx].userID = id;
      users[userIdx].connected = true;
    }
  }
  socketIO.emit("users", users);
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
      messages: [],
      usersInGroups: [],
    });
    console.log('vua tao group', chatGroups);
    socketIO
      .to('createJoinChat')
      .emit("newGroup", chatGroups);
    socket.emit('groupList', chatGroups);
  });

  socket.on("findGroup", (id) => {
    console.log('chatGroups data:', chatGroups)
    const filteredGroup = chatGroups.find(item => item.id === id);
    console.log(`filteredGroup ${socket.id}:`, filteredGroup);

    socket.join(filteredGroup.currentGroupName);
    console.log(`User ${socket.id} a join room :` + filteredGroup.currentGroupName);

    const user = users.find(x => x.userID === socket.id);
    if (user) {
      const usersInGroups = filteredGroup.usersInGroups.find(x => x.userID === user.userID);
      if (!usersInGroups) {
        filteredGroup.usersInGroups.push(user);
      }
    }
    console.log('chatGroups data:', chatGroups)

    socket.emit("foundGroup", filteredGroup.messages);
  });

  socket.on("privateMessage", ({ content, to }) => {
    console.log('privateMessage content', content);
    console.log('privateMessage to', to);
    const newMessage = {
      id: createUniqueId(),
      text: content.currentChatMessage,
      currentUserName: content.currentUserName,
      time: `${content.timeData.hour}:${content.timeData.minutes}`,
    };

    const idxUserTo = users.findIndex(x => x.userID === to);
    users[idxUserTo].messages.push(newMessage);
    const idxUserFrom = users.findIndex(x => x.userID === socket.id);
    users[idxUserFrom].messages.push(newMessage);
    console.log(users);

    socketIO.to(to).emit("newPrivateMessage", {
      newMessage: users[idxUserTo].messages,
      from: socket.id,
    });
    socket.emit("foundUserMessage", users[idxUserFrom].messages);
  });

  socket.on("newChatMessage", (data) => {
    const { currentChatMessage, groupId, currentUserName, timeData } = data;
    const findGroup = chatGroups.find(
      (item) => item.id === groupId
    );
    console.log('findGroup', findGroup);
    const newMessage = {
      id: createUniqueId(),
      text: currentChatMessage,
      currentUserName,
      time: `${timeData.hour}:${timeData.minutes}`,
    };

    findGroup.messages.push(newMessage);
    socketIO
      .to(findGroup.currentGroupName)
      .emit("newMessage", {groupData: findGroup, userName: currentUserName});
    // socket.emit("groupList", chatGroups);
    // socket.emit("foundGroup", findGroup.messages);
  });

  socket.on('logout', () => {
    socket.disconnect();
    console.log(`${socket.id} user is just logout`);
    const index = users.findIndex(x => x.userID === socket.id);
    if (index >= 0) {
      users[index].connected = false;
    }
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log(`${socket.id} user is just disconnected`);
    const index = users.findIndex(x => x.userID === socket.id);
    if (index >= 0) {
      users[index].connected = false;
    }
    console.log('users after disconnected', users)
    socketIO.emit('userDisconnected', { userID: socket.id, users });
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