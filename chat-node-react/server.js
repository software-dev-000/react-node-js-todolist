var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('new_client', function(pseudo) {
        console.log('New client: ' + pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_client', {pseudo: pseudo});
    });
    
    socket.on('message', function(message) {
        console.log('Server get message: ' + message + ' from ' + socket.pseudo);
        socket.broadcast.emit('message', {user: socket.pseudo, text: message});
    });
});

server.listen(8080);
console.log('Listening on port 8080...');