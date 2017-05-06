(function() {

'use strict';

var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('sky', 'assets/overcast.png');
    game.load.image('ship', 'assets/ship transparent.png');
    game.load.image('platform', 'assets/platform.png');
}

var ship;
var cursors;
var platforms;

function create() {
    game.world.setBounds(0, 0, 600, 15000);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'sky');

    ship = createShip();
    platforms = createPlatforms();

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    game.physics.arcade.collide(ship, platforms, explodeShip);

    ship.body.velocity.x = updateVelocity(ship.body.velocity.x, cursors.left.isDown, cursors.right.isDown);
}

function render() {
    game.debug.cameraInfo(game.camera, 50, 32);
}

function updateVelocity(shipVelocity, leftIsDown, rightIsDown) {
    var accDelta = 10;
    var brakeDelta = 10;

    if(leftIsDown) {
        return shipVelocity - accDelta;
    } else if(rightIsDown) {
        return shipVelocity + accDelta;
    } else {
        if(shipVelocity < -brakeDelta) {
            return shipVelocity + brakeDelta;
        } else if(shipVelocity > brakeDelta) {
            return shipVelocity - brakeDelta;
        } else {
            return 0;   
        }
    }
}

function createShip() {
    var ship = game.add.sprite((game.world.width - 40) / 2, game.world.height - 100, 'ship');

    game.physics.arcade.enable(ship);

    ship.body.collideWorldBounds = true;
    ship.body.velocity.y = -150;

    return ship;
}

function createPlatforms() {
    var platforms = game.add.group();

    platforms.enableBody = true;

    var min = -300;
    var max = 300;

    var y = game.world.height - 400;
    while(y > 0) {
        var x = min + Math.random() * (max - min);
        y = y - 250;

        var p = platforms.create(x, y, 'platform');
        p.body.immovable = true;
    }

    return platforms;
}

function explodeShip(ship) {
    ship.kill();
}

})();