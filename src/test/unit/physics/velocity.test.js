/* global expect */

'use strict';

const physics = require('../../../public/js/physics');

const G = 5;

describe('Calculating force', function () {
    const cases = [
        {
            it: 'calculates correctly between horizontally displaced bodies',
            bodyA: {
                x: 5,
                y: 0,
                radius: 5
            },
            bodyB: {
                x: -10,
                y: 0,
                radius: 7
            },
            expected: 53.734512850375395 * G
        }, {
            it: 'calculates correctly between vertically displaced bodies',
            bodyA: {
                x: 0,
                y: 7,
                radius: 9
            },
            bodyB: {
                x: 0,
                y: -13,
                radius: 7
            },
            expected: 97.93114966980914 * G
        }, {
            it: 'calculates correct between diagonally displaced bodies',
            bodyA: {
                x: -5,
                y: 7,
                radius: 9
            },
            bodyB: {
                x: 5,
                y: -13,
                radius: 7
            },
            expected: 78.34491973584731 * G
        }
    ];

    cases.forEach((c) => {
        it(c.it, function () {
            const force = physics.calculateForceBetween(c.bodyA, c.bodyB);
            expect(force).to.equal(c.expected);
        });
    });
});
