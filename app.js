//create server
const express = require('express');
const app = express();

//allowing static file send from folder "views"
app.use(express.static('views'));
//sendin ghte index html file
app.get('/', function(request, response) {
    response.render('index.ejs');
});

//setting up port
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    console.log(`listening on port : ${port}`);
});

//loading socket.io and binding to the server
const io = require('socket.io')(server);

//setting up the eventHandler for the "connection" event type
io.sockets.on('connection', function(socket) {
    //if 'username' is received, send the event 'is_online', and the html text 'bullet usename join the chat...'
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat...</i>');
    });

    //if 'disconnect' is received, send the event 'is_online', and the html text  'bullet usename left the chat...'
    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat...</i>');
    });

    //if 'chat_message is received, send the event 'chat_message', and the html text 'usename: message'
    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});