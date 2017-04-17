/* global Phaser */

'use strict';

/**
* Don't pollute global namespace
*/

const maths = require('./maths');
const physics = require('./physics');

const bounds = {
    x: window.outerWidth,
    y: window.outerHeight
};
const game = new Phaser.Game(bounds.x, bounds.y, Phaser.AUTO, '', {
    preload,
    create,
    update
});
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
const circleColour = 0xD0CECE;
let inCreation = false;
let circle;
let bodies;
let line;

function preload() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    window.bodies = bodies = game.add.group();
}

function create() {
    line = game.add.graphics(0, 0);
    line.beginFill(circleColour, 0.75);
    line.lineStyle(3, circleColour, 0.75);
}

function update() {
    detectOnClick();
    updateSystem();
    drawTrails();
}

function updateSystem() {
    calculateVelocities();

    const toChange = detectCollisions();
    toChange.toDestroy.concat(detectOutOfBounds());

    toChange.toDestroy.forEach((body) => {
        bodies.remove(body);
        body.destroy();
    });

    toChange.toCreate.forEach((body) => {
        circle = game.add.graphics(0, 0);
        deployCircle(body.x, body.y, body.radius, { velocity: body.velocity });
    });
}

function drawTrails() {
    bodies.forEach((body) => {
        for (let i = 0; i < body.trails.length - 1; i++) {
            body.trails[i].alpha -= 0.005;
        }

        body.trails[body.trails.length - 1].lineTo(body.x, body.y);

        extendTrail(body);
    });
}

function detectOutOfBounds() {
    const toDestroy = [];

    bodies.forEach((body) => {
        const outOfBounds = body.x + body.radius < 0 ||
            body.x - body.radius > bounds.x ||
            body.y + body.radius < 0 ||
            body.y - body.radius > bounds.y;

        if (outOfBounds) {
            toDestroy.push(body);
        }
    });

    return toDestroy;
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

    return {
        toDestroy,
        toCreate
    };
}

function calculateVelocities() {
    bodies.forEach((influencedBody) => {
        const mass = maths.areaOfCircle(influencedBody.radius);
        bodies.forEach((influencingBody) => {
            if (influencedBody !== influencingBody) {
                const force = physics.calculateForceBetween(influencedBody, influencingBody);

                const xDistance = influencingBody.x - influencedBody.x;
                const yDistance = influencingBody.y - influencedBody.y;
                const xWeighting = xDistance / (Math.abs(xDistance) + Math.abs(yDistance));
                const yWeighting = yDistance / (Math.abs(xDistance) + Math.abs(yDistance));

                influencedBody.body.velocity.x += (xWeighting * force) / mass;
                influencedBody.body.velocity.y += (yWeighting * force) / mass;
            }
        }, this, true);
    }, this, true);
}

function detectOnClick() {
    if (game.input.mousePointer.isDown && !game.input.mousePointer.justPressed()) {
        drawCircle();

        inCreation = true;
    } else if (inCreation) {
        setStartingVelocity();
    }
}

function setStartingVelocity() {
    clickState.newX = game.input.x;
    clickState.newY = game.input.y;

    if (clickState.hasChanged()) {
        line.clear();
        line.beginFill(circleColour, 0.75);
        line.lineStyle(3, circleColour, 0.75);
    }

    line.moveTo(clickState.originalX, clickState.originalY);
    line.lineTo(game.input.x, game.input.y);

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

        deployCircle(clickState.originalX, clickState.originalY, clickState.radius, { velocity });
        line.clear();
        inCreation = false;
    }
}

function drawCircle() {
    if (!inCreation) {
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

        clickState.newX = game.input.x;
        clickState.newY = game.input.y;
        clickState.radius = currentDragDistance;
    }
}

function deployCircle(posX, posY, radius, extras) {
    circle.clear();
    circle.beginFill(circleColour, 1);
    circle.drawCircle(0, 0, radius);

    const circleSprite = game.add.sprite(posX, posY);
    circleSprite.addChild(circle);

    circleSprite.radius = radius;
    circleSprite.trails = [];
    extendTrail(circleSprite);

    game.physics.arcade.enable(circleSprite, false);
    circleSprite.body.collideWorldBounds = false;

    if (extras) {
        circleSprite.body.velocity.x = extras.velocity.x;
        circleSprite.body.velocity.y = extras.velocity.y;
    }

    bodies.add(circleSprite);
}

function extendTrail(body) {
    const trailCount = body.trails.length;
    body.trails[trailCount] = game.add.graphics(0, 0);
    body.trails[trailCount].beginFill(circleColour, 0.75);
    body.trails[trailCount].lineStyle(3, circleColour, 0.75);
    body.trails[trailCount].moveTo(body.x, body.y);
}
