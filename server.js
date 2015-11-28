var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* serves all the static files */
app.use(express.static('static'));

var game = require('./Game.js').Game;
game = new game(1, 1);

// check for inactivity every 10 seconds
setInterval(updateInactivePlayers, 10000);

var listeningPort = 8000;//process.env.PORT || 80;
http.listen(listeningPort, function () { console.log('listening on *:' + listeningPort); });

io.on('connect', function (socket) {
    
    socket.on('role', function (role) {
        game.currentTime = Date.now();
        game.addPlayer(socket, role);
    });

    socket.on('move', function (dir) {
        if (socket.unit) {
            game.currentTime = Date.now();
            if (dir == 'up') game.moveUnit(socket.unit, 0);
            else if (dir == 'right') game.moveUnit(socket.unit, 1);
            else if (dir == 'down') game.moveUnit(socket.unit, 2);
            else if (dir == 'left') game.moveUnit(socket.unit, 3);
        }
    });

    socket.on('action', function (dir) {
        if (socket.unit) {
            game.currentTime = Date.now();
            if (dir == 'up') game.playerAction(socket.unit, 0);
            else if (dir == 'right') game.moveUnit(socket.unit, 1);
            else if (dir == 'down') game.moveUnit(socket.unit, 2);
            else if (dir == 'left') game.moveUnit(socket.unit, 3);
        }
    });

    socket.on('disconnect', function () {
        game.currentTime = Date.now();
        game.removePlayer(socket);
    });

    socket.on('pong', function (dat) {
        if (dat > game.currentPingNumber) {
            // cheating to stay online, disconnect
            game.currentTime = Date.now();
            game.removePlayer(socket);
            socket.disconnect();
        } else {
            socket.lastResponse = dat;
        }
    });
});

function updateInactivePlayers() {
    game.currentTime = Date.now();
    game.updatePlayers();
}