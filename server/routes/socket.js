import _ from "lodash";
import * as chat from '../middleware/chat';

const rooms = {};
const people = {};
const activeUsers = [];

export default function (socket) {
  if (!socket) {
    return;
  }

  socket.on("on:login", (user) => {
    if (!_.includes(activeUsers, user.userId)) {
      activeUsers.push(user.userId);
    }
    socket.join(user.userId);
    people[user.userId] = {
      domain: user.domain,
      userId: user.userId,
      socketId: socket.id,
      authToken: user.authToken
    };
    socket.emit("get:active-users", activeUsers);
    socket.broadcast.emit("get:active-users", activeUsers);
  });

  socket.on("on:logout", (userId) => {
    _.remove(activeUsers, (row) => {
      return row == userId;
    });
    socket.leave(userId);
    socket.broadcast.emit("get:active-users", activeUsers);
  });

  socket.on("on:join-room", (data) => {
    let channelId = data.channelId;
    let user = people[data.userId] || {};
    let room = rooms[channelId];
    if (!room) {
      chat.getChannelById(data, user)
        .then((res) => {
          let channel = res.data;
          delete channel.topics;
          delete channel.process;
          rooms[channelId] = channel;
        }, (err) => {
          console.log(err);
        });
    }
    // socket.join(roomId);
  });

  socket.on("on:group-message", (message) => {
    let roomId = message.channel.id;
    let room = rooms[roomId];
    let users = [];
    if (room) {
      users = room.userInfos;
    }    
    message.read = false; 
    chat.newMessage(message, people[message.sender.userId])
      .then(res => {
        let savedMessage = res.data;
        savedMessage.workspace = message.workspace;
        for (let i = 0; i < users.length; i++) {
          let user = users[i];
          if (people[user.userId]) {
            let receiverSocketId = people[user.userId].socketId;
            socket.in(receiverSocketId).emit("get:group-message", savedMessage);
          }
        }
      }, err => {
        console.log('Error', err);
      });
  });

  socket.on("on:send-message", (message) => {
    let room = rooms[message.thread.id];
    socket.in(room).emit("on:send-message", message);
  });

  socket.on("on:message-read-notify", (data) => {
    let user = people[data.messageInfo.userId] || {};
    if (user.authToken) {
      chat.readMessageNotify(data, user);
    }
  });

  socket.on("on:exception-received", (data) => {
    console.log('wow', data);
  });
}
