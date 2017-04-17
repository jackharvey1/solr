'use strict';

const maths = require('./maths');

const gravitationalConstant = 7;

function calculateForceBetween(bodyA, bodyB) {
    const massOfBodyA = maths.areaOfCircle(bodyA.radius);
    const massOfBodyB = maths.areaOfCircle(bodyB.radius);
    const distance = maths.pythagorasFromPoints(bodyA.x, bodyA.y, bodyB.x, bodyB.y);

    const force = gravitationalConstant * ((massOfBodyA * massOfBodyB) / Math.pow(distance, 2));

    return force;
}

function calculateResultantVelocity(bodyA, bodyB) {
    const bodyToCheckMass = maths.areaOfCircle(bodyA.radius);
    const otherBodyMass = maths.areaOfCircle(bodyB.radius);
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
