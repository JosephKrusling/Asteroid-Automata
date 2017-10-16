const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Entity = require('./entity');
const PlayerConnection = require('./PlayerConnection');
const GameWorld = require('./GameWorld');
const world = new GameWorld();

const config = {
    network: {
        tickFrequency: 200
    }
};

let playerConnections = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
});

io.on('connection', (socket) => {
    let pc = new PlayerConnection(socket);
    playerConnections.push(pc);
    socket.playerConnection = pc;


    socket.playerConnection.player = world.createTank();

    socket.on('disconnect', () => {
        pc.disconnected();
    });
    socket.on('scriptError', (error) => {
        console.log('we got a problem boss');
    });
    socket.on('action', (packet) => {
        processMove(pc, packet.desiredMove);
    })
});

http.listen(3000, () => {
    console.log('listening');
});

function processMove(playerConnection, move) {
    switch (move.command) {
        case 'shoot':
            world.spawnBullet(playerConnection.player, move.direction);
            break;
        default:
            console.log('Unrecognized Move.')
            console.log(JSON.stringify(move));

    }
}

function update() {

    // Broadcast the state to all the players.
    playerConnections.forEach(function(pc) {
        pc.socket.emit('tick', {
            state: world.getWorldSurrounding(pc.player)
        })
    });


    // Schedule update() to run again.
    setTimeout(() => {
        update();
    }, config.network.tickFrequency)
}
update();