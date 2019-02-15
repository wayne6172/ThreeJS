import $ from "jquery";
var socket = parent.socket;

$(function () {
    $('form').submit(function () {
        socket.emit('chat message', {reply: $('#m').val(), account: parent.account});
        $('#m').val('');
        return false;
    });
    socket.on('chat message',function (msg) {
        if(msg.isServer)
            $('#messages').append($('<li style="color:red">').text(msg.content));
        else
            $('#messages').append($('<li>').text(msg.content));
        window.scrollTo(0,document.body.scrollHeight);
    });
});
