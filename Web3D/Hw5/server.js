// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname));

// Chatroom

var numUsers = 0;
var playData = [];


io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;

    ++numUsers;
    addedUser = true;

    let nowPlayData = {
      ID: numUsers,
      pos: {x: 0, y: 0, z:0},
      rot: 0,
      frontRot: 0
    };

    console.log(nowPlayData);
    nowPlayData.pos.x = nowPlayData.ID * -30;
    if(nowPlayData.ID % 2 === 0)
      nowPlayData.pos.z = 20;

    playData.push(nowPlayData);

    socket.emit('login', {
      numUsers: numUsers,
      playData: playData,
      ID: numUsers
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      playData: nowPlayData
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });

  socket.on('update', (nowData,fn) => {
    console.log(nowData);
    playData[nowData.ID - 1].pos.x = nowData.pos.x;
    playData[nowData.ID - 1].pos.y = nowData.pos.y;
    playData[nowData.ID - 1].pos.z = nowData.pos.z;
    playData[nowData.ID - 1].rot = nowData.rot;
    playData[nowData.ID - 1].frontRot = nowData.frontRot;
    
    fn(playData);
  })
});