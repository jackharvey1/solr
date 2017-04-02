/* global Phaser */
/* eslint no-unused-vars: off */

const game = new Phaser.Game(window.outerWidth, window.outerHeight, Phaser.AUTO, '', {
    preload, create, update
});

let alreadyClicked = false;
let circle;
const clickCoordinates = {
    x: 0,
    y: 0
};

function preload() {
    // ...
}

function create() {
    const player = game.add.graphics(0, 0);

    player.beginFill(0xFF0000, 1);
    player.drawCircle(200, 200, 50);
    player.endFill();

    // player.clear();
    console.log(Object.keys(player));

    const playerSprite = game.add.sprite(0, 0);

    playerSprite.addChild(player);

    game.physics.enable(playerSprite, Phaser.Physics.ARCADE);
}

function update() {
    drawCircle();
}

function drawCircle() {
    if (game.input.mousePointer.isDown) {
        if (!alreadyClicked) {
            clickCoordinates.x = game.input.x;
            clickCoordinates.y = game.input.y;
            circle = new Phaser.Circle(game.input.x, game.input.y, 50);
        }

        const xDistance = clickCoordinates.x - game.input.x;
        const yDistance = clickCoordinates.y - game.input.y;
        circle.diameter = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) * 2;
        game.debug.geom(circle, '#FFFFFF');

        alreadyClicked = true;
    } else {
        alreadyClicked = false;
    }
}
