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
const maxRadius = 75;
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

    const radiusDrawn = maths.pythagorasFromPoints(clickState.originalX, clickState.originalY, game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    if (radiusDrawn <= maxRadius) {
        if (radiusDrawn < clickState.dragDistance()) {
            circle.clear();
            circle.beginFill(circleColour, 1);
        }
        circle.drawCircle(clickState.originalX, clickState.originalY, radiusDrawn * 2);

        clickState.newX = game.input.mousePointer.worldX;
        clickState.newY = game.input.mousePointer.worldY;
        clickState.radius = radiusDrawn;
    }

    inCreation = true;
}

function deploy(posX, posY, radius, extras) {
    if (circle) {
        circle.clear();
    }

    circle = game.add.graphics(0, 0);
    circle.beginFill(circleColour, 1);
    circle.drawCircle(0, 0, radius * 2);

    const circleSprite = game.add.sprite(posX, posY);
    circleSprite.addChild(circle);

    circleSprite.radius = radius;
    circleSprite.trails = [];

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
    line.lineTo(clickState.newX, clickState.newY);

    if (game.input.mousePointer.isDown) {
        const velocity = {};

        if (clickState.dragDistance() < clickState.radius) {
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
