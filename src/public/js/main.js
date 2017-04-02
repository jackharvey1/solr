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
    // ...
}

function update() {
    drawCircle();
}

function drawCircle() {
    if (game.input.mousePointer.isDown) {
        if (!alreadyClicked) {
            clickCoordinates.x = game.input.x;
            clickCoordinates.y = game.input.y;

            circle = game.add.graphics(0, 0);
            circle.beginFill(0xFFFFFF, 1);
        }

        const xDistance = clickCoordinates.x - game.input.x;
        const yDistance = clickCoordinates.y - game.input.y;
        const radius = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        circle.drawCircle(clickCoordinates.x, clickCoordinates.y, radius);

        alreadyClicked = true;
    } else {
        if (alreadyClicked) {
            const playerSprite = game.add.sprite(0, 0);
            playerSprite.addChild(circle);
            game.physics.enable(playerSprite, Phaser.Physics.ARCADE);
        }
        alreadyClicked = false;
    }
}
