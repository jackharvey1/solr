'use strict';

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

function radiusOfCombinedArea(radius1, radius2) {
    return radiusFromArea(areaOfCircle(radius1) + areaOfCircle(radius2));
}

module.exports = {
    pythagorasFromPoints,
    areaOfCircle,
    radiusFromArea,
    radiusOfCombinedArea
};
