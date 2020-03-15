const express = require('express')
var bodyParser = require("body-parser");

var app = express();
var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );

io.origins('*:*')

var name1 = ""
var name2 = ""
var score1 = 0
var score2 = 0

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.send('');
});

app.post('/score',function(req,res){
  name1 = req.body.name1;
  name2 = req.body.name2;
  score1 = req.body.score1;
  score2 = req.body.score2;
  console.log("Score updated to: "+score1+"-"+score2);
  io.emit('scoreUpdate', {"name1": name1, "score1": score1,"name2": name2, "score2":score2})
  res.end("done");
});

http.listen(8080,function(){
  console.log("Started on PORT 8080");
})

io.on('connection', function(socket){
  console.log("template connected");
  socket.on('getScore',function(args){
    io.emit('scoreUpdate', {"name1": name1, "score1": score1,"name2": name2, "score2":score2})
    console.log("score sent");
  });
})