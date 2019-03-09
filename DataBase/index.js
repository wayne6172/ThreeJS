var express = require('express');
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var port = process.envPORT || 3000;
var SQLconnection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'wayne50114',
   database: 'test'
});


app.get('/',(req,res) => {
    SQLconnection.query('SELECT * from test;',(error,results,field) => {
        console.log(results);
        res.send(results);
    });
});

SQLconnection.connect((err) => {
   if(err){
      console.log('mysql error connection: ' + err.stack);
   }
   else console.log('mysql success connection');
});



http.listen(port,() => {
   console.log('listening on *:' + port);
});