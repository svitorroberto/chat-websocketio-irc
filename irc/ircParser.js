var irc = require('irc');

var loggedClient = null;

var newClient = function (socket, params) {

  var client = new irc.Client(params.servidor, params.nick, {
    channels: params.canal,
    userName: params.nick,
    realName: 'INF-UFG-SOCKETIO'
  });

  var handleMessage = function (from, to, msg) {
    var data = {
      channel: to,
      from: from,
      message: msg,
      timestamp: Date.now()
    };
    socket.emit('receivedMessage', data);
  };

  client.addListener('message', function (from, to, msg) {
    handleMessage(from, to, msg);
  });

  client.addListener('error', function (error) {
    console.log(error);
  });

  return client;
};

exports.newConnection = function (socket) {
  socket.emit("requestSession");

  socket.on('newSession', function (params) {
    if(params != null)
    {
      loggedClient = newClient(socket, params);
    }
  });

  socket.on('disconnect', function () {
    loggedClient = null;
  });

  socket.on('enviaMensagem', function (mensagem) {
      console.log(mensagem);
    loggedClient.say(loggedClient.opt.channels[0], mensagem.corpo);
  });
  
};