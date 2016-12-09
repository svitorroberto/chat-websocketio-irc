var socket = io();

socket.on("requestSession", function () {
    var session = {
        nick: Cookies.get("nick"),
        servidor: Cookies.get("servidor"),
        canal: [Cookies.get("canal")]
    };
    socket.emit("newSession", session);
    $('#conexao').text('Conexão criada: irc//' + Cookies.get("nick") + '@' + Cookies.get("servidor") + '' + Cookies.get("canal"));
});

socket.on("receivedMessage", function (msg) {
    $('#mural').append($('<p>['+ timestamp_to_date(msg.timestamp) + "] " + msg.from + ": " + msg.message + '</p>'));
});

$( "#enviar" ).on( "click", function() {
    submete_mensagem()
});


$("#mensagem").keyup(function(event){
    if(event.keyCode == 13){
        submete_mensagem()
    }
});

function timestamp_to_date( timestamp ) {
    var date = new Date( timestamp );
    var hours = date.getHours();
    var s_hours = hours < 10 ? "0"+hours : ""+hours;
    var minutes = date.getMinutes();
    var s_minutes = minutes < 10 ? "0"+minutes : ""+minutes;
    var seconds = date.getSeconds();
    var s_seconds = seconds < 10 ? "0"+seconds : ""+seconds;
    return s_hours + ":" + s_minutes + ":" + s_seconds;
};

function submete_mensagem() {
    var texto = $('#mensagem').val();
    $('#mensagem').val('');
    var mensagem = {
        corpo: texto
    };

    socket.emit("enviaMensagem", mensagem);
    $('#mural').append($('<p>[' + timestamp_to_date($.now()) + '] ' + Cookies.get("nick") + ': ' + texto + '</p>'));
};