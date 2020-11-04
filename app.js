//create server
const express = require('express');
const app = express();

//allowing static file send from folder "views"
app.use(express.static('views'));
//sendin ghte index html file
app.get('/', function(request, response) {
    response.sendFile('index.html', { root: __dirname });
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
    //if 'login' is received, send the event 'is_online', and the html text 'bullet pseudoname join the chat...'
    socket.on('login', function(pseudoname) {
        socket.pseudoname = pseudoname;
        io.emit('participant', '🔵 <i>' + socket.pseudoname + ' joined the chat...</i>');
    });

    //if 'disconnect' is received, send the event 'is_online', and the html text  'bullet pseudoname left the chat...'
    socket.on('disconnect', function(pseudoname) {
        io.emit('participant', '🔴 <i>' + socket.pseudoname + ' left the chat...</i>');
    });

    //if 'submitted_message' is received, send the event 'submitted_message', and the html text 'pseudoname: message'
    socket.on('submitted_message', function(message) {
        io.emit('submitted_message', '<strong>' + socket.pseudoname + '</strong>: ' + message);
    });

});