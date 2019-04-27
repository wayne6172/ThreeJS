var express = require('express');
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var port = process.envPORT || 3000;
var SQLconnection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'wayne50114',
   database: 'test',
});


app.get('/inputGrade',(req,res) => {
    var account = req.query.account;
    var className = req.query.className;
    var grade = req.query.grade;
    
    SQLconnection.query(`INSERT INTO \`grade\` (\`account\`, \`grade\`, \`id\`, \`classs\`)`
           + ` VALUES ('${account}', '${grade}', NULL, '${className}');`,(error,results,field) => {
		if(error) throw error;
        res.send('成功輸入');
    });
});


app.get('/queryStudent',(req,res) => {
    var account = req.query.account;

    SQLconnection.query(`SELECT * FROM grade WHERE account = '${account}';`,(error,results,field)=>{
        if(error)throw error;

        if(results.length == 0){
            res.send('查無此學生成績');
        }
        else {
            var sum = 0, total = 0;
            results.forEach(element => {
                sum += element.grade;
                total++;
            });
            res.send('此學生目前成績平均為' + (sum / total));
        }
    });
})

app.get('/',(req,res) => {
	res.sendFile(__dirname + '/index.html');
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