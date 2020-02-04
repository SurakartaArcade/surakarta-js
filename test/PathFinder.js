const { PathFinder } = require('../lib/traverse-utils/path-finder')
const { Directions } = require('../lib/traverse-utils/Directions')
const { NOT_FILLED, RED_PLAYER, Surakarta } = require('../lib/Surakarta')

require('chai').should()

describe('PathFinder', function () {
    it('Finds zero steps for orthogonally clogged pebble', function () {
        const surakarta = Surakarta.fromState([
            NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED,
            NOT_FILLED, RED_PLAYER, RED_PLAYER, RED_PLAYER, NOT_FILLED, NOT_FILLED,
            NOT_FILLED, RED_PLAYER, RED_PLAYER, RED_PLAYER, NOT_FILLED, NOT_FILLED,
            NOT_FILLED, RED_PLAYER, RED_PLAYER, RED_PLAYER, NOT_FILLED, NOT_FILLED,
            NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED,
            NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED, NOT_FILLED
        ])

        const attackSequence = PathFinder.findPath(surakarta, 2, 2, Directions.LEFT, null)

        attackSequence.should.equal(false)
    })
})
