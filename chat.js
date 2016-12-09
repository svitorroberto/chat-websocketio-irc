var express = require('express');
var irc = require('./irc/ircParser.js');
var http = require('http');
var bodyParser = require('body-parser');  // processa corpo de requests
var cookieParser = require('cookie-parser');  // processa cookies
var socketio = require('socket.io');
var path = require('path');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(cookieParser());
app.use(express.static('static'));
app.use(express.static('public'));

var proxy_id = 0;
var server = http.createServer(app);
var io = socketio(server);

app.get('/', function(req, res){
    if (req.cookies.servidor && req.cookies.nick && req.cookies.canal && req.cookies.foto) {
    res.sendFile(path.join(__dirname, '/public/teste.html'));
  }
  else {
    res.sendFile(path.join(__dirname, '/public/login.html'));
  }
});

app.post('/login', function (req, res) {
  res.cookie('nick', req.body.nome);
  res.cookie('canal', req.body.canal);
  res.cookie('servidor', req.body.servidor);
  res.cookie('foto', req.body.foto);
  res.redirect('/');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

server.listen(5000,'0.0.0.0', function(){
  console.log('listening on *:5000');
});