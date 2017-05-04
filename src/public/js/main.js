/* global Phaser */

'use strict';

/**
* Don't pollute global namespace
*/

const boundsMultiplier = 10;
const dimensions = {
    screen: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    origin: {
        x: window.innerWidth * (boundsMultiplier * -0.5),
        y: window.innerHeight * (boundsMultiplier * -0.5)
    },
    world: {
        width: window.innerWidth * boundsMultiplier,
        height: window.innerHeight * boundsMultiplier
    }
};

const game = module.exports = new Phaser.Game(dimensions.screen.width, dimensions.screen.height, Phaser.AUTO, '', {
    preload,
    create,
    update
});

const maths = require('./maths');
const physics = require('./physics');
const circle = require('./circle');
const trails = require('./trails');

let cursors;

let xStep = 4,
    yStep = 4;

function preload() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
}

function create() {
    circle.init();

    game.world.setBounds(
        dimensions.origin.x,
        dimensions.origin.y,
        dimensions.world.width,
        dimensions.world.height
    );
    game.camera.x = dimensions.screen.width * -0.5;
    game.camera.y = dimensions.screen.height * -0.5;
}

function update() {
    detectOnClick();
    detectCursorKeys();
    updateSystem();
}

function detectOutOfBounds(body) {
    const isOutOfBounds = body.x + body.radius < dimensions.origin.x ||
        body.x - body.radius > dimensions.world.width ||
        body.y + body.radius < dimensions.origin.y ||
        body.y - body.radius > dimensions.world.height;

    return isOutOfBounds;
}

function updateSystem() {
    for (let i = 0; i < circle.group.children.length; i++) {
        const bodyToCheck = circle.group.children[i];

        if (detectOutOfBounds(bodyToCheck)) {
            remove(bodyToCheck);
        } else {
            trails.draw(bodyToCheck);
            for (let j = 0; j < circle.group.children.length; j++) {
                if (i !== j) {
                    const otherBody = circle.group.children[j];
                    detectCollision(bodyToCheck, otherBody, i);
                    calculateGravitation(bodyToCheck, otherBody);
                }
            }
        }
    }
}

function detectCollision(body, otherBody) {
    const distance = maths.pythagorasFromPoints(body.x, body.y, otherBody.x, otherBody.y);
    if (distance <= body.radius + otherBody.radius) {
        const bodyToLive = body.radius < otherBody.radius ? otherBody : body;
        const newRadius = maths.radiusOfCombinedArea(body.radius, otherBody.radius);

        const newVelocity = physics.calculateResultantVelocity(body, otherBody);

        circle.deploy(bodyToLive.x, bodyToLive.y, newRadius, { velocity: newVelocity });
        remove(body);
        remove(otherBody);
    }
}

function remove(body) {
    body.trails.forEach((trail) => {
        trail.clear();
    });
    circle.group.remove(body);
    body.destroy();
}

function calculateGravitation(body, otherBody) {
    const mass = maths.calculateMass(body.radius);
    const force = physics.calculateForceBetween(body, otherBody);

    const xDistance = otherBody.x - body.x;
    const yDistance = otherBody.y - body.y;
    const xWeighting = xDistance / (Math.abs(xDistance) + Math.abs(yDistance));
    const yWeighting = yDistance / (Math.abs(xDistance) + Math.abs(yDistance));

    body.body.velocity.x += (xWeighting * force) / mass;
    body.body.velocity.y += (yWeighting * force) / mass;
}

function detectCursorKeys() {
    if (cursors.left.isDown || cursors.right.isDown) {
        xStep += 1;
        if (cursors.left.isDown) {
            game.camera.x -= xStep;
        } else if (cursors.right.isDown) {
            game.camera.x += xStep;
        }
    }

    if (cursors.down.isDown || cursors.up.isDown) {
        yStep += 1;
        if (cursors.up.isDown) {
            game.camera.y -= yStep;
        } else if (cursors.down.isDown) {
            game.camera.y += yStep;
        }
    }

    if (cursors.left.isUp && cursors.right.isUp) {
        xStep = 4;
    }
    if (cursors.up.isUp && cursors.down.isUp) {
        yStep = 4;
    }
}

function detectOnClick() {
    if (game.input.mousePointer.isDown && !game.input.mousePointer.justPressed()) {
        circle.draw();
    } else if (circle.inCreation) {
        circle.setStartingVelocity();
    }
}
