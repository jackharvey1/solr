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
const gravitationalConstant = 0.01;
let alreadyClicked = false;
let circle;
let bodies;

function preload() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    bodies = game.add.group();
}

function create() {
    // ...
}

function update() {
    createBody();
    bodies.forEach(calculateVelocity, this, true);
    bodies.forEach(detectCollision);
}

function detectCollision(bodyToCheck) {
    bodies.forEach((otherBody) => {
        if (bodyToCheck !== otherBody) {
            const distance = pythagorasFromPoints(bodyToCheck.x, bodyToCheck.y, otherBody.x, otherBody.y);
            if (distance <= bodyToCheck.radius + otherBody.radius) {
                const bodyToKill = bodyToCheck.radius < otherBody.radius ? bodyToCheck : otherBody;
                bodyToKill.kill();
            }
        }
    });
}

function calculateVelocity(influencedBody) {
    const influencedMass = areaOfCircle(influencedBody.radius);
    bodies.forEach((influencingBody) => {
        if (influencedBody !== influencingBody) {
            const influencingMass = areaOfCircle(influencingBody.radius);
            const distance = pythagorasFromPoints(influencedBody.x, influencedBody.y, influencingBody.x, influencingBody.y);
            const xDistance = influencingBody.x - influencedBody.x;
            const yDistance = influencingBody.y - influencedBody.y;
            const xWeight = xDistance / Math.abs(xDistance + yDistance);
            const yWeight = yDistance / Math.abs(xDistance + yDistance);
            const force = gravitationalConstant * ((influencedMass * influencingMass) / Math.pow(distance, 2));

            influencedBody.body.velocity.x += force * xWeight;
            influencedBody.body.velocity.y += force * yWeight;
        }
    }, this, true);
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

    game.physics.p2.enable(circleSprite, false);
    circleSprite.body.setCircle(radius);

    bodies.add(circleSprite);
}

function pythagorasFromPoints(fromX, fromY, toX, toY) {
    const xDistance = fromX - toX;
    const yDistance = fromY - toY;
    const xSquared = Math.pow(xDistance, 2);
    const ySquared = Math.pow(yDistance, 2);
    return Math.sqrt(xSquared + ySquared);
}

function areaOfCircle(radius) {
    return Math.PI * Math.pow(radius, 2);
}

function radiusFromArea(area) {
    return Math.sqrt(area / Math.PI);
}
