var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.envPORT || 3000;
var mysql = require('mysql');
var SQLconnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'wayne50114',
    database : 'project'
});

SQLconnection.connect(function(err){
    if(err){
        console.log('error connecting: ' + err.stack);
    }
});

app.use(express.static(__dirname + '/build'));

class Server{
	constructor(){
		this.userNum = 0;
		this.user = [] // {name,socketID};
	}

	newUser(name,socketID){
		for(let i = 0; i < this.user.length; i++)
			if(this.user[i] === undefined) {
                this.user[i] = {name: name, socketID: socketID, state: undefined}
                this.userNum++;
                return;
			}

		this.user.push({name: name, socketID: socketID, state: undefined});
		this.userNum++;
	}

	removeUser(socketID){
		let i;
		for(i = 0; i < this.user.length; i++){
			if(this.user[i] && this.user[i].socketID === socketID){
                this.user[i] = undefined;
				this.userNum--;
				return;
            }
		}
	}

    getNameByServerID(socketID){
		var name;
		this.user.forEach(function (t) {
			if(t && t.socketID === socketID)
				name = t.name;
        });
		return name;
    }

    updateOneClient(msg){
		this.user.forEach((e) => {
			if(e && e.name === msg.account)
				e.state = {pos: msg.pos, angle: msg.angle}
		});
	}
}

var testServer = new Server();

io.on('connection',function(socket){
	console.log('new connect');
    console.log(socket.id);

	socket.on('chat message',function(msg){
		io.emit('chat message',{isServer: false, content: msg.account + ': ' + msg.reply});
	});

	socket.on("disconnect",function () {
        var name = testServer.getNameByServerID(socket.id);
		testServer.removeUser(socket.id);

        io.emit('chat message',{isServer: true, content: String(name + ' 已離線')});
    });

	socket.on("log_in",(msg) => {
        SQLconnection.query('SELECT account FROM account WHERE account = \'' + msg.account + '\' AND password = SHA2(\'' +
			msg.password + '\',224);',(error, results, fields) => {
        	if(error) throw error;
        	if(results.length > 0){
        		socket.emit('log_in_success',{account: msg.account});

                testServer.newUser(msg.account,socket.id);
                socket.emit('get_ID',msg.account);
                io.emit('chat message',{isServer: true, content: String(msg.account + ' 已上線')});
			}
			else socket.emit('log_in_fail');


        });
	});

	socket.on("sign_up",(msg,fn) => {
        SQLconnection.query('SELECT account FROM account WHERE account = \'' + msg.account + '\';', (error, results, fields) => {
        	if(error) throw error;

        	if(results.length > 0){
                fn({success: false, log: "此帳號已出現過，請直接登入，謝謝"});
			}
			else {
				SQLconnection.query('SET NAMES \'UTF8\'');
				SQLconnection.query('INSERT INTO account(account,password,email,name) VALUES (\''+ msg.account + '\',SHA2(\'' +
					msg.password + '\',224),\'' + msg.email + '\',\'' + msg.name + '\');');
                fn({success: true, log: ""});
            }
		});
	});

	socket.on('init',(msg,fn) => {
		testServer.updateOneClient(msg);
		fn(testServer.user);
	});

	socket.on('clientUpdate',(msg,fn) => {
        testServer.updateOneClient(msg);
		fn(testServer.user);
	});

});

http.listen(port,'25.11.169.242',function(){
	console.log('listening on *:' + port);
});
