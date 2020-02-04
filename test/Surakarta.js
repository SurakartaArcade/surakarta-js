const {
    Surakarta,
    NOT_FILLED,
    RED_PLAYER,
    BLACK_PLAYER
} = require('../lib')
const chai = require('chai')
chai.should()

/**
 * Generate a state from a list of positions.
 */
function generateState (list) {
    const array = new Array(36)

    for (let i = 0; i < 36; i++) {
        array[i] = NOT_FILLED
    }

    for (let i = 0; i < list.length; i++) {
        array[list[i].row * 6 + list[i].col] = list[i].player === 'red' ? RED_PLAYER : BLACK_PLAYER
    }

    return array
}

describe('Surakarta', function () {
    it('Position should step in all free directions', function () {
        const game = Surakarta.fromState(generateState([
            {
                row: 1,
                col: 1,
                player: 'red'
            }
        ]))

        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (i === 1 && j === 1) {
                    continue
                }

                game.step(1, 1, i, j, true) // Step into i, j without turn/responding
                game.step(i, j, 1, 1, true) // Come back for next move
            }
        }
    })

    it("'gameover' event should be fired for a manufactured state", function () {
        const game = Surakarta.fromState(generateState([
            {
                row: 3,
                col: 4,
                player: 'red'
            },
            {
                row: 2,
                col: 4,
                player: 'black'
            }
        ]))

        let listenerHeard = false

        const listener = function () {
            listenerHeard = true
        }

        game.on('gameover', listener)
        game.step(3, 4, 2, 4, false, true) // respond & capture

        listenerHeard.should.be.equal(true)
    })
})
