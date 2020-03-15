var express = require("express");
var bodyParser = require("body-parser");
var socket = require("socket.io")
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/third',function(req,res){
  res.sendfile("socket_third.html");
});

app.get('/scoreboard',function(req,res){
    res.sendfile("socket_scoreboard.html");
});

app.post('/score',function(req,res){
  var score1 = req.body.score1;
  var score2 = req.body.score2;
  console.log("Score is: "+score1+":"+score2);
  res.end("done");
});

app.listen(8080,function(){
  console.log("Started on PORT 8080");
})