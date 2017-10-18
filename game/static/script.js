var sun = new Image();
var moon = new Image();
var earth = new Image();
function init() {
    // Set up canvas globals
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Set up socket
    socket = io();
    socket.on('connect', function() {
        socket.emit('type', 'viewer');
    });

    socket.on('stateUpdate', function(state) {
        lastPacketReceived = Date.now();
        tanks = state.tanks;
        bullets = state.bullets;
        coins = state.coins;

       // console.log(JSON.stringify(bullets));
    });


    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();


    tanks = [];
    bullets = [];
    coins = [];


    // Start 'er up.
    window.requestAnimationFrame(draw);
}

function draw() {
    ctx.globalCompositeOperation = "source-over"; // make front color overwrite
    ctx.fillStyle = "rgba(15,15,30,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.globalCompositeOperation = 'lighter'; // make colors add

    // console.log(`Draw (${tanks.length} tanks) (${bullets.length} bullets)`);

    for (var i = 0; i < coins.length; i++) {

        var coin = coins[i];
        // console.log(JSON.stringify(bullet));
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 255, 128, 1)';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 128, 1)';
        ctx.fill();

        // ctx.font = '12px Arial';
        // ctx.fillText(`x:${coin.x.toFixed(1)}, y:${coin.y.toFixed(1)}`, coin.x, coin.y);

    }

    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        // console.log(JSON.stringify(bullet));
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 0, 0, 1)';
        ctx.beginPath();

        // Interpolate to find estimated x of bullet.
        var timeAdvanced = (Date.now() - lastPacketReceived) / 1000;
        // console.log(timeAdvanced);
        var deltaX = timeAdvanced * bullet.speed * Math.cos(bullet.direction);
        var deltaY = timeAdvanced * bullet.speed * Math.sin(bullet.direction);


        ctx.arc(bullet.x + deltaX, bullet.y + deltaY, bullet.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        ctx.fill();
    }

    for (var i = 0; i < tanks.length; i++) {
        var tank = tanks[i];
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 0, 255, 1)';

        // Advanced beak math
        // DON'T TRY THIS AT HOME KIDS
        let beakLength = 2.0;
        let beakAngle = Math.PI/4;
        ctx.beginPath();
        ctx.moveTo(tank.x + (tank.radius * Math.cos(tank.direction - beakAngle)), tank.y + (tank.radius * Math.sin(tank.direction - beakAngle)));
        ctx.lineTo(tank.x + (tank.radius * beakLength * Math.cos(tank.direction)), tank.y + (tank.radius * beakLength * Math.sin(tank.direction)));
        ctx.lineTo(tank.x + (tank.radius * Math.cos(tank.direction + beakAngle)), tank.y + (tank.radius * Math.sin(tank.direction + beakAngle)));
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 128, 255, 1)';
        ctx.fill();

        // draw the tank
        ctx.beginPath();
        ctx.arc(tank.x, tank.y, tank.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 128, 255, 1)';
        ctx.fill();


        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.font = '12px Arial';
        ctx.fillText(`x:${tank.x.toFixed(1)}, y:${tank.y.toFixed(1)}`, tank.x, tank.y);

    }



    setTimeout(draw, 0);
}


init();