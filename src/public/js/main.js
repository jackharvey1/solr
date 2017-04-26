/* global Phaser */

'use strict';

/**
* Don't pollute global namespace
*/

const bounds = {
    width: window.innerWidth,
    height: window.innerHeight
};

const game = module.exports = new Phaser.Game(bounds.width, bounds.height, Phaser.AUTO, '', {
    preload,
    create,
    update
});

const maths = require('./maths');
const physics = require('./physics');
const circle = require('./circle');

const boundsMultiplier = 10;
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
        bounds.width * (boundsMultiplier * -0.5),
        bounds.height * (boundsMultiplier * -0.5),
        bounds.width * boundsMultiplier,
        bounds.height * boundsMultiplier
    );
    game.camera.x = bounds.width * -0.5;
    game.camera.y = bounds.width * -0.5;
}

function update() {
    detectOnClick();
    detectCursorKeys();
    updateSystem();
    drawTrails();
}

function updateSystem() {
    calculateVelocities();

    const toChange = detectCollisions();
    toChange.toDestroy.concat(detectOutOfBounds());

    toChange.toDestroy.forEach((body) => {
        body.trails.forEach((trail) => {
            trail.clear();
        });
        circle.group.remove(body);
        body.destroy();
    });

    toChange.toCreate.forEach((body) => {
        circle.deploy(body.x, body.y, body.radius, { velocity: body.velocity });
    });
}

function drawTrails() {
    circle.group.forEach((body) => {
        let lastLivingIndex = 0;
        for (let i = body.trails.length - 1; i > 0; i--) {
            if (body.trails[i].alpha <= 0.005) {
                lastLivingIndex = i;
            }
            body.trails[i].alpha -= 0.005;
        }

        body.trails.splice(0, lastLivingIndex - 1);

        body.trails[body.trails.length - 1].lineTo(body.x, body.y);

        body.extendTrail();
    });
}

function detectOutOfBounds() {
    const toDestroy = [];

    circle.group.forEach((body) => {
        const outOfBounds = body.x + body.radius < 0 ||
            body.x - body.radius > bounds.width ||
            body.y + body.radius < 0 ||
            body.y - body.radius > bounds.height;

        if (outOfBounds) {
            toDestroy.push(body);
        }
    });

    return toDestroy;
}

function detectCollisions() {
    const toCreate = [];
    const toDestroy = [];

    for (let i = 0, l = circle.group.children.length; i < l; i++) {
        const bodyToCheck = circle.group.children[i];
        for (let j = i + 1; j < l; j++) {
            const otherBody = circle.group.children[j];
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
    circle.group.forEach((influencedBody) => {
        const mass = maths.areaOfCircle(influencedBody.radius);
        circle.group.forEach((influencingBody) => {
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
