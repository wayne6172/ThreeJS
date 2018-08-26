var shelljs = require('shelljs');
var express = require('express');
var app = express();

app.get('/getData',function(req,res){

    shelljs.exec('main.exe', function(status,output){
        /*console.log('Get Data Exit status:',status);
        console.log('Exit output:',output);*/

        var output = {
            status: status,
            output: output
        };

        res.writeHead(200,{
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
        });

        res.write(JSON.stringify((output)));
        res.end();
    });
});

app.get('/setData',function(req,res){
    var player = req.query.player;

    shelljs.exec('main.exe ' + player, function(status,output){
        //console.log('Set Data Exit status:',status);
        console.log("click");
    });
});


var server = app.listen(1337,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('server started on http://' + host + ':' + port);
});
