'use strict';

module.exports.pythagorasFromPoints = function (fromX, fromY, toX, toY) {
    const xDistance = fromX - toX;
    const yDistance = fromY - toY;
    const xSquared = Math.pow(xDistance, 2);
    const ySquared = Math.pow(yDistance, 2);
    return Math.sqrt(xSquared + ySquared);
};

module.exports.areaOfCircle = function (radius) {
    return Math.PI * Math.pow(radius, 2);
};

module.exports.radiusFromArea = function (area) {
    return Math.sqrt(area / Math.PI);
};
