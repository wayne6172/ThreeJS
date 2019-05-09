var express = require('express');
var app = express();
var shelljs = require('shelljs');

app.use(express.static(__dirname + '/'));

app.get('/api', (req,res) => {
    let reqObj = req.query;

    shelljs.exec(__dirname + `/CircleRect.exe ${reqObj.circleR} ${reqObj.circleX} ${reqObj.circleY} ${reqObj.RecWidth} ${reqObj.RecHeight} ${reqObj.RecPosX} ${reqObj.RecPosY}`, (status,output) => {
        
        var data = {
            status: status,
            output: output
        }

        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
        });
    
        res.write(JSON.stringify(data));
        res.end();
    });

    
    
    
});

app.listen(1337, () => {
    console.log("success listen");
})