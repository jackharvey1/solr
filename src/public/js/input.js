/* global Phaser */

'use strict';

const game = require('./main');
const circle = require('./circle');

let cursors;
let zoomInKey,
    zoomOutKey;

let xStep = 4,
    yStep = 4;


function init() {
    cursors = game.input.keyboard.createCursorKeys();
    zoomInKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    zoomOutKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
}

function detect() {
    detectZoomKeys();
    detectPanKeys();
    detectOnClick();
}

function detectZoomKeys() {
    if (zoomInKey.isDown && game.camera.scale.x < 2) {
        game.camera.scale.x += 0.005;
        game.camera.scale.y += 0.005;
    } else if (zoomOutKey.isDown && game.camera.scale.x > 0.25) {
        game.camera.scale.x -= 0.005;
        game.camera.scale.y -= 0.005;
    }
}

function detectPanKeys() {
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

module.exports = {
    init,
    detect
};
