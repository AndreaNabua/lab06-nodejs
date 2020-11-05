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
//the connection event is raider by the server whenever it receives any request
//this is not specific to socket<
//it is raided also when an HTTP request (get, post...) are received...
//so we are registering a function to handle this event
io.sockets.on('connection', function(socket) {
    //socket here is the payload received by the server along with the connection event

    //a socket carries a message made of two fields (topic and text), like key value
    //the programmer decides the names of the topics and the text they want to send
    //the etxt can be json objects for example

    //Here, we are registering three other callback functions 
    //to act on the specific type of topics carried by the socket
    //the names of the topics are (login, particiapnt, submitted_message) are arbitrary, you can choose any string for naming topics

    //For each of these topics, the callback extracts the payload and broadcasts a message to all clients

    //if 'login' is received with the socket message, send the event 'participant', and the html text 'bullet pseudoname join the chat...'
    socket.on('login', function(pseudoname) {
        //here the payload is the pseudoname, sent by the browser
        //we are adding the pseudoname as attribute to the socket obeject 
        //in order to use it subsequently...
        socket.pseudoname = pseudoname;
        //we send the event 'participant' and a message including the pseudoname
        io.emit('participant', '🔵 <i>' + socket.pseudoname + ' joined the chat...</i>');
    });

    //if 'disconnect' is received, send the event 'particiapnt', and the html text  'bullet pseudoname left the chat...'
    socket.on('disconnect', function(pseudoname) {
        //here we are sending a message that also include the pseudoname
        io.emit('participant', '🔴 <i>' + socket.pseudoname + ' left the chat...</i>');
    });

    //if 'submitted_message' is received, send the event 'submitted_message', and the html text 'pseudoname: message'
    socket.on('submitted_message', function(message) {
        //here we are extracting the message payload and sending it to clients preceeded by the psudoname
        io.emit('submitted_message', '<strong>' + socket.pseudoname + '</strong>: ' + message);
    });

});