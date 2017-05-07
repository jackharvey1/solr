'use strict';

const game = require('./main');
const trail = {
    colour: 0xD0CECE,
    opacity: 0.75,
    width: 3
};

function draw(body) {
    fade(body);
    extend(body);
}

function extend(body) {
    const trailCount = body.trails.length;
    body.trails[trailCount] = game.add.graphics(0, 0);
    body.trails[trailCount].beginFill(trail.colour, trail.opacity);
    body.trails[trailCount].drawCircle(body.x, body.y, 3);
}

function fade(body) {
    let lastLivingIndex = 0;
    for (let j = 0; j < body.trails.length - 1; j++) {
        if (body.trails[j].alpha <= 0.005) {
            lastLivingIndex = j;
        }
        body.trails[j].alpha -= 0.005;
    }
    body.trails.splice(0, lastLivingIndex);
}

module.exports = {
    draw,
    extend
};
