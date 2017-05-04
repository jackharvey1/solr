'use strict';

const maths = require('./maths');

const gravitationalConstant = 0.3;

function calculateForceBetween(bodyA, bodyB) {
    const massOfBodyA = maths.calculateMass(bodyA.radius);
    const massOfBodyB = maths.calculateMass(bodyB.radius);
    const distance = maths.pythagorasFromPoints(bodyA.x, bodyA.y, bodyB.x, bodyB.y);

    const force = gravitationalConstant * ((massOfBodyA * massOfBodyB) / Math.pow(distance, 2));

    return force;
}

function calculateResultantVelocity(bodyA, bodyB) {
    const bodyToCheckMass = maths.calculateMass(bodyA.radius);
    const otherBodyMass = maths.calculateMass(bodyB.radius);
    const combinedMass = bodyToCheckMass + otherBodyMass;
    const bodyToCheckWeighting = bodyToCheckMass / combinedMass;
    const otherBodyWeighting = otherBodyMass / combinedMass;

    return {
        x: (bodyToCheckWeighting * bodyA.body.velocity.x) + (otherBodyWeighting * bodyB.body.velocity.x),
        y: (bodyToCheckWeighting * bodyA.body.velocity.y) + (otherBodyWeighting * bodyB.body.velocity.y)
    };
}

module.exports = {
    calculateForceBetween,
    calculateResultantVelocity
};
