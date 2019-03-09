var socket,account = undefined,ID = undefined, userNum = undefined;

$(() =>{
    socket = io('25.11.169.242:3000');
    $('#chat').attr("src",'log_in/log_in.html');
    $('#threeJS').attr("src","video/video.html");

    socket.on('log_in_success',(msg) => {
        account = msg.account;
        ID = msg.userID;
        userNum = msg.userNum;
        alert('登入成功');
        $('#chat').attr("src",'chat/chat.html');
        $('#threeJS').attr("src","ThreeJS/index.html");
    });
});
