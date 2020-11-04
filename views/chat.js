function init() {
    //when the page loads
    //create the scoket and connect to server on port 3000
    socket = io.connect('http://localhost:3000');


    // submit text message without reload/refresh the page
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        //send the value of the input to server through socket
        socket.emit('chat_message', $('#txt').val());
        $('#txt').val(''); //empty the input field for any new message to b typed
        return false;
    });

    // when 'chat_message' event is received, append message received from server username
    socket.on('chat_message', function(msg) {
        $('#messages').append($('<li>').html(msg));
    });

    // when receiving th 'on_line' event, append text with username
    socket.on('is_online', function(username) {
        $('#messages').append($('<li>').html(username));
    });

    // ask for username
    username = prompt('Please tell me your name');
    //emit username to sever
    socket.emit('username', username);

}