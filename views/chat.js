function init() {
    //when the page loads
    //create the scoket and connect to server on port 3000
    socket = io.connect('http://localhost:3000');


    // submit text message without reload/refresh the page
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        //send the value of the input to server through socket
        socket.emit('submitted_message', $('#txt').val());
        $('#txt').val(''); //empty the input field for any new message to b typed
        return false;
    });

    // when receiving th 'on_line' event, append text with username
    socket.on('participant', function(pseudoname) {
        $('#messages').append($('<li>').html(pseudoname));
    });

    // when 'chat_message' event is received, append message received from server username
    socket.on('submitted_message', function(msg) {
        $('#messages').append($('<li>').html(msg));
    });

    // ask for username
    pseudoname = prompt('Please provide us with a pseudoname');
    //emit username to sever
    socket.emit('login', pseudoname);

}