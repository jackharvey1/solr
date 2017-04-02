/* global Phaser */
/* eslint no-unused-vars: off */

const game = new Phaser.Game(window.outerWidth, window.outerHeight, Phaser.AUTO, '', {
    preload, create, update
});
const clickState = {
    origX: 0,
    origY: 0,
    newX: 0,
    newY: 0,
    dragDistance: function () {
        return pythagorasFromPoints(this.origX, this.origY, this.newX, this.newY);
    }
};
const circleColour = 0xD0CECE;
let alreadyClicked = false;
let circle;

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
            clickState.origX = game.input.x;
            clickState.origY = game.input.y;

            circle = game.add.graphics(0, 0);
            circle.beginFill(circleColour, 1);
        }

        const currentDragDistance = pythagorasFromPoints(clickState.origX, clickState.origY, game.input.x, game.input.y);

        if (currentDragDistance < clickState.dragDistance()) {
            circle.clear();
            circle.beginFill(circleColour, 1);
        }

        clickState.newX = game.input.x;
        clickState.newY = game.input.y;

        circle.drawCircle(clickState.origX, clickState.origY, currentDragDistance);

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

function pythagorasFromPoints(fromX, fromY, toX, toY) {
    const xDistance = fromX - toX;
    const yDistance = fromY - toY;
    const xSquared = Math.pow(xDistance, 2);
    const ySquared = Math.pow(yDistance, 2);
    return Math.sqrt(xSquared + ySquared);
}
