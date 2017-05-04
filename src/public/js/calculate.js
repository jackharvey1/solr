'use strict';

const maths = require('./maths');

const gravitationalConstant = 0.3;

function mass(radius) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3);
}

function forceBetween(bodyA, bodyB) {
    const massOfBodyA = mass(bodyA.radius);
    const massOfBodyB = mass(bodyB.radius);
    const distance = maths.pythagorasFromPoints(bodyA.x, bodyA.y, bodyB.x, bodyB.y);

    const force = gravitationalConstant * ((massOfBodyA * massOfBodyB) / Math.pow(distance, 2));

    return force;
}

function resultantVelocity(bodyA, bodyB) {
    const bodyToCheckMass = mass(bodyA.radius);
    const otherBodyMass = mass(bodyB.radius);
    const combinedMass = bodyToCheckMass + otherBodyMass;
    const bodyToCheckWeighting = bodyToCheckMass / combinedMass;
    const otherBodyWeighting = otherBodyMass / combinedMass;

    return {
        x: (bodyToCheckWeighting * bodyA.body.velocity.x) + (otherBodyWeighting * bodyB.body.velocity.x),
        y: (bodyToCheckWeighting * bodyA.body.velocity.y) + (otherBodyWeighting * bodyB.body.velocity.y)
    };
}

function gravitation(body, otherBody) {
    const massOfBody = mass(body.radius);
    const force = forceBetween(body, otherBody);

    const xDistance = otherBody.x - body.x;
    const yDistance = otherBody.y - body.y;
    const xWeighting = xDistance / (Math.abs(xDistance) + Math.abs(yDistance));
    const yWeighting = yDistance / (Math.abs(xDistance) + Math.abs(yDistance));

    body.body.velocity.x += (xWeighting * force) / massOfBody;
    body.body.velocity.y += (yWeighting * force) / massOfBody;
}

module.exports = {
    mass,
    forceBetween,
    resultantVelocity,
    gravitation
};
