var THREE = require('three');
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
    database : 'test'
});

SQLconnection.connect(function(err){
    if(err){
        console.log('error connecting: ' + err.stack);
    }
});

app.use(express.static(__dirname + '/build'));

class RobotState{
	constructor(playerName){
		this.playerName = playerName;
		this.speed = 0.0;
		this.maxWalkingSpeed = 0.5;
		this.maxRunningSpeed = 1.0;
		this.isRunning = false;
		this.pos = new THREE.Vector3(Math.random() * 200 - 100, 0, Math.random() * 200 - 100);
		this.angle = Math.random() * Math.PI * 2 - Math.PI;
		this.actionName = 'Idle';
		this.specialAction = '';
	}
}

class Game{
	constructor(){
		this.AllUser = [];
	}
	add(i,name){
		this.AllUser[i] = new RobotState(name);
	}
	remove(i){
		this.AllUser[i] = undefined;
	}
	updateByClient(i,msg){
        if(msg === 'pressed_A'){
            this.AllUser[i].angle += 0.1;
        }

        if(msg === 'pressed_D'){
            this.AllUser[i].angle -= 0.1;
        }

        if(msg === 'down_shift'){
            this.AllUser[i].isRunning = true;
        }

        if(msg === 'up_shift'){
            this.AllUser[i].isRunning = false;
        }

        if(msg === 'pressed_W'){
            this.AllUser[i].specialAction = '';
            if(this.AllUser[i].isRunning)
                this.AllUser[i].speed += 0.05;
            else
                this.AllUser[i].speed += 0.01;
        }

        if(msg === 'pressed_S'){
            this.AllUser[i].specialAction = '';
            if(this.AllUser[i].isRunning)
                this.AllUser[i].speed -= 0.05;
            else
                this.AllUser[i].speed -= 0.01;
        }

        if(msg === 'down_Q') {
            this.AllUser[i].speed = 0.0;
            this.AllUser[i].specialAction = 'Dance';
        }
	}

	update(i){
        if(this.AllUser[i].speed < 0)
            this.AllUser[i].speed = 0;

        if(this.AllUser[i].isRunning)
            this.AllUser[i].speed = Math.min(this.AllUser[i].maxRunningSpeed,this.AllUser[i].speed);
        else
            this.AllUser[i].speed = Math.min(this.AllUser[i].maxWalkingSpeed,this.AllUser[i].speed);

        if(this.AllUser[i].specialAction === '') {
            if (this.AllUser[i].speed === 0)
                this.AllUser[i].actionName = 'Idle';
            else if (this.AllUser[i].speed > 0 && this.AllUser[i].speed <= this.AllUser[i].maxWalkingSpeed)
                this.AllUser[i].actionName = 'Walking';
            else if (this.AllUser[i].speed > this.AllUser[i].maxWalkingSpeed && this.AllUser[i].speed <= this.AllUser[i].maxRunningSpeed)
                this.AllUser[i].actionName = 'Running';
        }
        else this.AllUser[i].actionName = this.AllUser[i].specialAction;

        this.AllUser[i].pos.add(new THREE.Vector3(0,0,this.AllUser[i].speed).applyAxisAngle(new THREE.Vector3(0,1,0),this.AllUser[i].angle));
	}
	allData(i){
		if(i >= 0)
			this.update(i);
		return this.AllUser;
	}
}

class Server{
	constructor(){
		this.userNum = 0;
		this.user = []; // {name,socketID};
		this.gameScene = new Game();
	}

	newUser(name,socketID){
		for(let i = 0; i < this.user.length; i++)
			if(this.user[i] === undefined) {
                this.gameScene.add(i,name);
                this.user[i] = {name: name, socketID: socketID}
                this.userNum++;
                return i;
			}
        this.gameScene.add(this.userNum);
		this.user.push({name: name, socketID: socketID});
		this.userNum++;
		return this.userNum - 1;
	}

	removeUser(socketID){
		let i;
		for(i = 0; i < this.user.length; i++){
			if(this.user[i] && this.user[i].socketID === socketID){
                this.gameScene.remove(i);
                this.user[i] = undefined;
				this.userNum--;
				return;
            }
		}
	}

    getNameByServerID(socketID){
		var name = undefined;
		this.user.forEach(function (t) {
			if(t && t.socketID === socketID)
				name = t.name;
        });
		return name;
    }

    updateByClient(i,msg){
		this.gameScene.updateByClient(i,msg);
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

		if(name !== undefined)
        	io.emit('chat message',{isServer: true, content: String(name + ' 已離線')});
    });

	socket.on("log_in",(msg) => {
        SQLconnection.query('SELECT account FROM account WHERE account = \'' + msg.account + '\' AND password = SHA2(\'' +
			msg.password + '\',224);',(error, results, fields) => {
        	if(error) throw error;
        	if(results.length > 0){
                let userID = testServer.newUser(msg.account,socket.id);
        		socket.emit('log_in_success',{account: msg.account, userID: userID, userNum: testServer.userNum});

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

	socket.on('initClient', (msg, fn) => {
        fn({allGameData: testServer.gameScene.allData(-1), allPlayerData: testServer.user});
	});

	socket.on('Client_pressed_W', (msg) => {
        testServer.updateByClient(msg.ID, 'pressed_W');
	});

    socket.on('Client_pressed_A', (msg) => {
        testServer.updateByClient(msg.ID, 'pressed_A');
    });

    socket.on('Client_pressed_S', (msg) => {
        testServer.updateByClient(msg.ID, 'pressed_S');
    });

    socket.on('Client_pressed_D', (msg) => {
        testServer.updateByClient(msg.ID, 'pressed_D');
    });

    socket.on('Client_down_shift', (msg) => {
        testServer.updateByClient(msg.ID, 'down_shift');
    });

    socket.on('Client_down_Q', (msg) => {
        testServer.updateByClient(msg.ID, 'down_Q');
    });

    socket.on('Client_up_shift', (msg) => {
        testServer.updateByClient(msg.ID, 'up_shift');
    });

    socket.on('Client_update',(msg,fn) => {
    	fn({allGameData: testServer.gameScene.allData(msg.ID), allPlayerData: testServer.user});
	});
});

http.listen(port,'25.11.169.242',function(){
	console.log('listening on *:' + port);
});
