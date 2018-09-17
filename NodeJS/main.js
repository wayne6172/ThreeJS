var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var playerSum = 0;

app.get('/',function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection',function (socket) {
    socket.on('toggle',function (msg) {

    });

    socket.on('init',function (msg) {
        playerSum++;
        io.emit('init',String(playerSum));
    });
});

http.listen(port,function () {
   console.log('listening on *:' + port);
});
