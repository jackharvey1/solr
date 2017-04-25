/* global Phaser */

'use strict';

const game = require('./main');
const maths = require('./maths');

const clickState = {
    originalX: 0,
    originalY: 0,
    newX: 0,
    newY: 0,
    radius: 0,
    dragDistance: function () {
        return maths.pythagorasFromPoints(this.originalX, this.originalY, this.newX, this.newY);
    },
    hasChanged: function () {
        return this.originalX !== this.newX || this.originalY !== this.newY;
    }
};

let circle;
const circleColour = 0xD0CECE;
let inCreation = false;
let bodies;
let line;

function init() {
    module.exports.group = bodies = game.add.group();

    line = game.add.graphics(0, 0);
    line.beginFill(circleColour, 0.75);
    line.lineStyle(3, circleColour, 0.75);
}

function draw() {
    if (!inCreation) {
        clickState.originalX = game.input.mousePointer.worldX;
        clickState.originalY = game.input.mousePointer.worldY;

        circle = game.add.graphics(0, 0);
        circle.beginFill(circleColour, 1);
    }

    const currentDragDistance = maths.pythagorasFromPoints(clickState.originalX, clickState.originalY, game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    if (currentDragDistance <= 150) {
        if (currentDragDistance < clickState.dragDistance()) {
            circle.clear();
            circle.beginFill(circleColour, 1);
        }
        circle.drawCircle(clickState.originalX, clickState.originalY, currentDragDistance);

        clickState.newX = game.input.mousePointer.worldX;
        clickState.newY = game.input.mousePointer.worldY;
        clickState.radius = currentDragDistance;
    }

    inCreation = true;
}

function deploy(posX, posY, radius, extras) {
    circle.clear();

    circle = game.add.graphics(0, 0);
    circle.beginFill(circleColour, 1);
    circle.drawCircle(0, 0, radius);

    const circleSprite = game.add.sprite(posX, posY);
    circleSprite.addChild(circle);

    circleSprite.radius = radius;
    circleSprite.trails = [];
    circleSprite.extendTrail();

    game.physics.arcade.enable(circleSprite, false);
    circleSprite.body.collideWorldBounds = false;

    if (extras) {
        circleSprite.body.velocity.x = extras.velocity.x;
        circleSprite.body.velocity.y = extras.velocity.y;
    }

    bodies.add(circleSprite);
}

function setStartingVelocity() {
    clickState.newX = game.input.mousePointer.worldX;
    clickState.newY = game.input.mousePointer.worldY;

    if (clickState.hasChanged()) {
        line.clear();
        line.beginFill(circleColour, 0.75);
        line.lineStyle(3, circleColour, 0.75);
    }

    line.moveTo(clickState.originalX, clickState.originalY);
    line.lineTo(game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    if (game.input.mousePointer.isDown) {
        const velocity = {};

        if (maths.pythagorasFromPoints(clickState.originalX, clickState.originalY, clickState.newX, clickState.newY) < clickState.radius) {
            velocity.x = 0;
            velocity.y = 0;
        } else {
            velocity.x = clickState.originalX - clickState.newX;
            velocity.y = clickState.originalY - clickState.newY;

            const xWeighting = velocity.x / (Math.abs(velocity.x) + Math.abs(velocity.y));
            const yWeighting = velocity.y / (Math.abs(velocity.x) + Math.abs(velocity.y));

            velocity.x -= xWeighting * clickState.radius;
            velocity.y -= yWeighting * clickState.radius;
        }

        deploy(clickState.originalX, clickState.originalY, clickState.radius, { velocity });
        line.clear();
        inCreation = false;
    }
}

Phaser.Sprite.prototype.extendTrail = function () {
    const trailCount = this.trails.length;
    this.trails[trailCount] = game.add.graphics(0, 0);
    this.trails[trailCount].beginFill(circleColour, 0.75);
    this.trails[trailCount].lineStyle(3, circleColour, 0.75);
    this.trails[trailCount].moveTo(this.x, this.y);
};

module.exports = {
    init,
    draw,
    deploy,
    setStartingVelocity,
    group: bodies
};

Object.defineProperty(module.exports, "inCreation", {
    get: () => inCreation
});
