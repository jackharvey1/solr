/* global Phaser */
/* eslint no-unused-vars: off */

const game = new Phaser.Game(window.outerWidth, window.outerHeight, Phaser.AUTO, '', {
    preload, create, update
});
const clickState = {
    originalX: 0,
    originalY: 0,
    newX: 0,
    newY: 0,
    dragDistance: function () {
        return pythagorasFromPoints(this.originalX, this.originalY, this.newX, this.newY);
    }
};
const circleColour = 0xD0CECE;
let alreadyClicked = false;
let circle;
let bodies;

function preload() {
    bodies = game.add.group();
}

function create() {
    // ...
}

function update() {
    drawCircle();
}

function createBody() {
    if (game.input.mousePointer.isDown) {
        if (!alreadyClicked) {
            clickState.originalX = game.input.x;
            clickState.originalY = game.input.y;

            circle = game.add.graphics(0, 0);
            circle.beginFill(circleColour, 1);
        }

        drawCircle(clickState.originalX, clickState.originalY, game.input.x, game.input.y);

        alreadyClicked = true;
    } else {
        if (alreadyClicked) {
            deployCircle(clickState.originalX, clickState.originalY, clickState.dragDistance());
        }
        alreadyClicked = false;
    }
}

function drawCircle(originX, originY, edgeX, edgeY) {
    const currentDragDistance = pythagorasFromPoints(originX, originY, edgeX, edgeY);

    if (currentDragDistance < clickState.dragDistance()) {
        circle.clear();
        circle.beginFill(circleColour, 1);
    }

    clickState.newX = game.input.x;
    clickState.newY = game.input.y;

    circle.drawCircle(clickState.originalX, clickState.originalY, currentDragDistance);
}

function deployCircle(posX, posY, radius) {
    circle.clear();
    circle.beginFill(circleColour, 1);
    circle.drawCircle(0, 0, radius);

    const circleSprite = game.add.sprite(posX, posY);
    circleSprite.addChild(circle);
    circleSprite.radius = radius;

    bodies.add(circleSprite);
}

function pythagorasFromPoints(fromX, fromY, toX, toY) {
    const xDistance = fromX - toX;
    const yDistance = fromY - toY;
    const xSquared = Math.pow(xDistance, 2);
    const ySquared = Math.pow(yDistance, 2);
    return Math.sqrt(xSquared + ySquared);
}
