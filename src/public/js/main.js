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
const calculate = require('./calculate');
const circle = require('./circle');
const trails = require('./trails');
const input = require('./input');

function preload() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.canvas.oncontextmenu = (e) => {
        e.preventDefault();
    };
}

function create() {
    circle.init();
    input.init();

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
    input.detect();
    updateSystem();
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
                    calculate.gravitation(bodyToCheck, otherBody);
                    detectCollision(bodyToCheck, otherBody, i);
                }
            }
        }
    }
}

function detectOutOfBounds(body) {
    const isOutOfBounds = body.x + body.radius < dimensions.origin.x ||
        body.x - body.radius > dimensions.world.width ||
        body.y + body.radius < dimensions.origin.y ||
        body.y - body.radius > dimensions.world.height;

    return isOutOfBounds;
}

function detectCollision(body, otherBody) {
    const distance = maths.pythagorasFromPoints(body.x, body.y, otherBody.x, otherBody.y);
    if (distance <= body.radius + otherBody.radius) {
        const bodyToLive = body.radius < otherBody.radius ? otherBody : body;
        const newRadius = maths.radiusOfCombinedArea(body.radius, otherBody.radius);

        const newVelocity = calculate.resultantVelocity(body, otherBody);

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
