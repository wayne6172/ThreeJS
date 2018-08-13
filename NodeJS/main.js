var shelljs = require('shelljs');
var express = require('express');
var app = express();

app.get('/api',function(req,res){
    console.log('url: ' + req.url);

    var argv = req.query.argv;

    shelljs.exec('main.exe ' + argv, function(status,output){
        console.log('Exit status:',status);
        console.log('Exit output:',output);

        var outputStr = argv + '! = ' + output;
        
        console.log(outputStr);

        res.writeHead(200,{"Content-Type": "text/plain"});
        res.write(outputStr);
        res.end();
    });
});

var server = app.listen(1337,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('server started on http://' + host + ':' + port);
});
