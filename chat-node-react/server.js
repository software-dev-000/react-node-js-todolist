var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

var usersNames = [];

io.sockets.on('connection', function (socket, pseudo) {    
    socket.on('new_client', function(pseudo) {
        console.log('New client: ' + pseudo);
        socket.pseudo = pseudo;
        usersNames.push(pseudo);
        socket.broadcast.emit('new_client', {pseudo: pseudo});
        socket.emit('init', {users: usersNames});
    });
    
    socket.on('message', function(message) {
        socket.broadcast.emit('message', {user: socket.pseudo, text: message});
    });
    
    socket.on('disconnect', function() {
        socket.broadcast.emit('client_left', {pseudo: socket.pseudo});
        usersNames.splice(usersNames.indexOf(socket.pseudo), 1);
        console.log(socket.pseudo + ' left');
    });
});

server.listen(8080);
console.log('Listening on port 8080...');