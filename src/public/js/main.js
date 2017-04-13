/* global Phaser */

'use strict';

const maths = require('./maths');
const physics = require('./physics');

const game = new Phaser.Game(window.outerWidth, window.outerHeight, Phaser.AUTO, '', {
    preload,
    create,
    update
});
const clickState = {
    originalX: 0,
    originalY: 0,
    newX: 0,
    newY: 0,
    dragDistance: function () {
        return maths.pythagorasFromPoints(this.originalX, this.originalY, this.newX, this.newY);
    }
};
const circleColour = 0xD0CECE;
let alreadyClicked = false;
let circle;
let bodies;

function preload() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    bodies = game.add.group();
}

function create() {
    // ...
}

function update() {
    createBody();
    calculateVelocities();
    detectCollisions();
}

function detectCollisions() {
    const toCreate = [];
    const toDestroy = [];

    for (let i = 0, l = bodies.children.length; i < l; i++) {
        const bodyToCheck = bodies.children[i];
        for (let j = i + 1; j < l; j++) {
            const otherBody = bodies.children[j];
            const distance = maths.pythagorasFromPoints(bodyToCheck.x, bodyToCheck.y, otherBody.x, otherBody.y);
            if (distance <= bodyToCheck.radius + otherBody.radius) {
                const bodyToLive = bodyToCheck.radius < otherBody.radius ? otherBody : bodyToCheck;
                const newRadius = maths.radiusOfCombinedArea(bodyToCheck.radius, otherBody.radius);

                const newVelocity = physics.calculateResultantVelocity(bodyToCheck, otherBody);

                toCreate.push({
                    x: bodyToLive.x,
                    y: bodyToLive.y,
                    radius: newRadius,
                    velocity: newVelocity
                });

                toDestroy.push(bodyToCheck);
                toDestroy.push(otherBody);
            }
        }
    }

    toDestroy.forEach((body) => {
        bodies.remove(body);
    });

    toCreate.forEach((body) => {
        circle = game.add.graphics(0, 0);
        deployCircle(body.x, body.y, body.radius, { velocity: body.velocity });
    });
}

function calculateVelocities() {
    bodies.forEach((influencedBody) => {
        const mass = maths.areaOfCircle(influencedBody.radius);
        bodies.forEach((influencingBody) => {
            if (influencedBody !== influencingBody) {
                const force = physics.calculateForceBetween(influencedBody, influencingBody) / mass;

                const xDistance = influencingBody.x - influencedBody.x;
                const yDistance = influencingBody.y - influencedBody.y;
                const xWeighting = xDistance / Math.abs(xDistance + yDistance);
                const yWeighting = yDistance / Math.abs(xDistance + yDistance);

                influencedBody.body.velocity.x += xWeighting * force;
                influencedBody.body.velocity.y += yWeighting * force;
            }
        }, this, true);
    }, this, true);
}

function createBody() {
    if (game.input.mousePointer.isDown) {
        drawCircle();

        alreadyClicked = true;
    } else {
        if (alreadyClicked) {
            deployCircle(clickState.originalX, clickState.originalY, clickState.dragDistance());
        }
        alreadyClicked = false;
    }
}

function drawCircle() {
    if (!alreadyClicked) {
        clickState.originalX = game.input.x;
        clickState.originalY = game.input.y;

        circle = game.add.graphics(0, 0);
        circle.beginFill(circleColour, 1);
    }

    const currentDragDistance = maths.pythagorasFromPoints(clickState.originalX, clickState.originalY, game.input.x, game.input.y);

    if (currentDragDistance <= 150) {
        if (currentDragDistance < clickState.dragDistance()) {
            circle.clear();
            circle.beginFill(circleColour, 1);
        }
        circle.drawCircle(clickState.originalX, clickState.originalY, currentDragDistance);
    }

    clickState.newX = game.input.x;
    clickState.newY = game.input.y;

}

function deployCircle(posX, posY, radius, extras) {
    circle.clear();
    circle.beginFill(circleColour, 1);
    circle.drawCircle(0, 0, radius);

    const circleSprite = game.add.sprite(posX, posY);
    circleSprite.addChild(circle);
    circleSprite.radius = radius;

    game.physics.arcade.enable(circleSprite, false);
    circleSprite.body.collideWorldBounds = false;

    if (extras) {
        circleSprite.body.velocity.x = extras.velocity.x;
        circleSprite.body.velocity.y = extras.velocity.y;
    }

    bodies.add(circleSprite);
}
