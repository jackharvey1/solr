/* global expect */

'use strict';

const physics = require('../../../public/js/physics');

describe('Calculating resulting velocity', function () {
    describe('with equal mass', function () {
        const cases = [
            {
                it: 'cancels out when all is equivalent',
                bodyA: {
                    body: {
                        velocity: {
                            x: 5,
                            y: 5
                        }
                    },
                    radius: 5
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: -5,
                            y: -5
                        }
                    },
                    radius: 5
                },
                expected: {
                    x: 0,
                    y: 0
                }
            }, {
                it: 'calculates correctly between horizontally colliding bodies with differing velocities',
                bodyA: {
                    body: {
                        velocity: {
                            x: 10,
                            y: 0
                        }
                    },
                    radius: 5
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: -5,
                            y: 0
                        }
                    },
                    radius: 5
                },
                expected: {
                    x: 2.5,
                    y: 0
                }
            }, {
                it: 'calculates correctly between vertically colliding bodies with differing velocities',
                bodyA: {
                    body: {
                        velocity: {
                            x: 0,
                            y: 10
                        }
                    },
                    radius: 5
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: 0,
                            y: -5
                        }
                    },
                    radius: 5
                },
                expected: {
                    x: 0,
                    y: 2.5
                }
            }, {
                it: 'calculates correctly between diagonally colliding bodies with differing velocities',
                bodyA: {
                    body: {
                        velocity: {
                            x: 5,
                            y: 5
                        }
                    },
                    radius: 5
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: -10,
                            y: -10
                        }
                    },
                    radius: 5
                },
                expected: {
                    x: -2.5,
                    y: -2.5
                }
            }, {
                it: 'calculates correctly between bodies with non-parallel trajectories with differing velocities',
                bodyA: {
                    body: {
                        velocity: {
                            x: 4,
                            y: -3
                        }
                    },
                    radius: 5
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: -3,
                            y: 4
                        }
                    },
                    radius: 5
                },
                expected: {
                    x: 0.5,
                    y: 0.5
                }
            }
        ];

        cases.forEach((c) => {
            it(c.it, function () {
                const force = physics.calculateResultantVelocity(c.bodyA, c.bodyB);
                expect(force).to.deep.equal(c.expected);
            });
        });
    });

    describe('with differing mass', function () {
        const cases = [
            {
                it: 'calculates correctly between horizontally colliding bodies with opposite velocities',
                bodyA: {
                    body: {
                        velocity: {
                            x: 5,
                            y: 0
                        }
                    },
                    radius: 7
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: -5,
                            y: 0
                        }
                    },
                    radius: 5
                },
                expected: {
                    x: 1.6216216216216215,
                    y: 0
                }
            }, {
                it: 'calculates correctly between vertically colliding bodies with opposite velocities',
                bodyA: {
                    body: {
                        velocity: {
                            x: 0,
                            y: 5
                        }
                    },
                    radius: 9
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: 0,
                            y: -5
                        }
                    },
                    radius: 7
                },
                expected: {
                    x: 0,
                    y: 1.2307692307692308
                }
            }, {
                it: 'calculates correctly between diagonally colliding bodies with opposite velocities',
                bodyA: {
                    body: {
                        velocity: {
                            x: 5,
                            y: 5
                        }
                    },
                    radius: 5
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: -5,
                            y: -5
                        }
                    },
                    radius: 3
                },
                expected: {
                    x: 2.352941176470588,
                    y: 2.352941176470588
                }
            }, {
                it: 'calculates correctly between bodies with non-parallel trajectories',
                bodyA: {
                    body: {
                        velocity: {
                            x: 4,
                            y: -3
                        }
                    },
                    radius: 3
                },
                bodyB: {
                    body: {
                        velocity: {
                            x: -4,
                            y: 3
                        }
                    },
                    radius: 5
                },
                expected: {
                    x: -1.8823529411764703,
                    y: 1.4117647058823526
                }
            }
        ];

        cases.forEach((c) => {
            it(c.it, function () {
                const force = physics.calculateResultantVelocity(c.bodyA, c.bodyB);
                expect(force).to.deep.equal(c.expected);
            });
        });
    });
});
