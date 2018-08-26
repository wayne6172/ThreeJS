var localStorage = require('localStorage');
var express = require('express');
var app = express();

localStorage.clear();

app.get('/api',function(req,res){
    var player = parseInt(req.query.player);
    var turn = String(req.query.turn);

    var isTurnStr = localStorage.getItem('isTurn');
    var isTurn;
    if(isTurnStr === null){
        isTurn = {turn: true,turn2: true};
    }
    else isTurn = JSON.parse(isTurnStr);

    if(player === 0)isTurn.turn = (turn == 'true');
    else isTurn.turn2 = (turn == 'true');

    var outputObj = {
        status: 1,
        output: isTurn.turn + ' ' + isTurn.turn2
    };

    localStorage.setItem('isTurn',JSON.stringify(isTurn));

    console.log(isTurnStr);

    res.writeHead(200,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
    });

    res.write(JSON.stringify(outputObj));
    res.end();
});


var server = app.listen(1337,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('server started on http://' + host + ':' + port);
});
