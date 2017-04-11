/* global expect */

'use strict';

const physics = require('../public/js/physics');

describe('Physics calculations', function () {
    describe('calculating force', function () {
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
                expected: 0.5373451285037539
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
                expected: 0.9793114966980915
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
                expected: 0.7834491973584732
            }
        ];

        cases.forEach((c) => {
            it(c.it, function () {
                const force = physics.calculateForceBetween(c.bodyA, c.bodyB);
                expect(force).to.equal(c.expected);
            });
        });
    });
});
