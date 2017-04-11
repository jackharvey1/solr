'use strict';

const maths = require('./maths');

const gravitationalConstant = 0.01;

module.exports.calculateForceBetween = function(bodyA, bodyB) {
    const massOfBodyA = maths.areaOfCircle(bodyA.radius);
    const massOfBodyB = maths.areaOfCircle(bodyB.radius);
    const distance = maths.pythagorasFromPoints(bodyA.x, bodyA.y, bodyB.x, bodyB.y);

    const force = gravitationalConstant * ((massOfBodyA * massOfBodyB) / Math.pow(distance, 2));

    return force;
};
