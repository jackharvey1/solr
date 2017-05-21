/* global Phaser */

'use strict';

const game = require('./main');
const circle = require('./circle');

let mouse,
    camera;

let cursors,
    zoomInKey,
    zoomOutKey;

let xStep = 4,
    yStep = 4;

function init() {
    mouse = game.input.mousePointer;
    camera = game.camera;
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
    if (zoomInKey.isDown && camera.scale.x < 2) {
        camera.scale.x += 0.005;
        camera.scale.y += 0.005;
    } else if (zoomOutKey.isDown && camera.scale.x > 0.25) {
        camera.scale.x -= 0.005;
        camera.scale.y -= 0.005;
    }
}

function detectPanKeys() {
    if (cursors.left.isDown || cursors.right.isDown) {
        xStep += 1;
        if (cursors.left.isDown) {
            camera.x -= xStep;
        } else if (cursors.right.isDown) {
            camera.x += xStep;
        }
    }

    if (cursors.down.isDown || cursors.up.isDown) {
        yStep += 1;
        if (cursors.up.isDown) {
            camera.y -= yStep;
        } else if (cursors.down.isDown) {
            camera.y += yStep;
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
    if (mouse.isDown && !mouse.justPressed()) {
        circle.draw();
    } else if (circle.inCreation) {
        circle.setStartingVelocity();
    }
}

module.exports = {
    init,
    detect
};
