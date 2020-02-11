import EventEmitter from 'eventemitter3'
import TraverseUtils, { LEFT, UP, RIGHT, DOWN, Directions, findPath } from './traverse-utils'
import PlayerStats from './PlayerStats'
import { validateStep } from './step-utils'

export const NOT_FILLED = -1
export const RED_PLAYER = 0 // starting player
export const BLACK_PLAYER = 1 // other player

/**
 * Handle the state of an actual Surakarta game.
 */
export class Surakarta extends EventEmitter {
    /**
     * Constructs a Surakarta board state with the pebbles in their initial
     * positions.
     * @param {boolean} [noInit=false] - whether not to initialize the board
     */
    constructor (noInit = false) {
        super()

        /**
         * States of each pebble position.
         * @member {Array<number>}
         * @readonly
         */
        this.states = new Array(36)

        /**
         * No. of moves done already.
         * @member {number}
         */
        this.turn = 0

        /**
         * Responders that are invoked on the turns of the red &
         * black players, and then on both. Both type responders are notified
         * first.
         * @member {Array<Array<SurakartaResponder>>}
         */
        this.responders = [[], [], []]

        /**
         * Stats for the red & black player.
         * @member {{ red: PlayerStats, black: PlayerStats }}
         */
        this.playerStats = {
            red: new PlayerStats(),
            black: new PlayerStats()
        }

        if (!noInit) {
            for (let i = 0; i < 12; i++) {
                this.states[i] = RED_PLAYER
            }
            for (let i = 12; i < 24; i++) {
                this.states[i] = NOT_FILLED
            }
            for (let i = 24; i < 36; i++) {
                this.states[i] = BLACK_PLAYER
            }

            this.playerStats.red.pebbles = 12
            this.playerStats.black.pebbles = 12
        }
    }

    /**
     * Index of a position in {@code this.states}
     * @param {number} row
     * @param {number} column
     * @returns {number}
     */
    indexOf (r, c) {
        return r * 6 + c
    }

    state (row, column) {
        if (row < 0 || column < 0 || row >= 6 || column >= 6) {
            return null
        }

        return this.states[row * 6 + column]
    }

    /**
     * The player whose turn it is currently.
     * @member {number}
     */
    get turnPlayer () {
        return (this.turn % 2)
    }

    /**
     * @member {'red' | 'black'}
     */
    get turnPlayerColor () {
        return this.turnPlayer === 0 ? 'red' : 'black'
    }

    /**
     * Perform a simple move on the board. Only validation that occurs is if the
     * destination is already filled or if it isn't the pebble's turn.
     *
     * _If the game is finished due to this move_: The responders will not be notified,
     * rather the 'gameover' event is emitted.
     *
     * @param {number} rs - initial position row
     * @param {number} cs - intial position column
     * @param {number} rd - final position row
     * @param {number} cd - final position column
     * @param {boolean} [noRespond=false] - whether not to consider this a
     *  turning move, e.g. increment the current turn.
     * @param {boolean} capture - is this a capture move?
     * @throws if destination is already filled
     */
    step (rs, cs, rd, cd, noRespond = false, capture = false) {
        const is = this.indexOf(rs, cs)
        const id = this.indexOf(rd, cd)

        if (this.states[is] !== this.turnPlayer) {
            throw new Error('Not turning player pebble')
        }
        if (!capture && this.states[id] !== NOT_FILLED) { // capture is used internally
            throw new Error('Cannot step into destination since it is already filled')
        }

        capture = this.states[id] !== NOT_FILLED

        this.states[id] = this.states[is]
        this.states[is] = NOT_FILLED

        if (!noRespond) {
            let color

            if (capture) {
                color = this.turnPlayerColor
                --this.playerStats[color].pebbles
            }

            if (capture && this.playerStats[color].pebbles <= 0) {
                this.emit('gameover', color)
            } else {
                this.turn++
                this._notifyRespondersOnTurn()
            }
        }
    }

    /**
     * Wrapper around `step` that validates the step using `validateStep`.
     */
    safeStep (rs, cs, rd, cd, noRespond = false) {
        if (validateStep(rs, cs, rd, cd)) {
            this.step(rs, cs, rd, cd, noRespond)
            return true
        } else {
            return false
        }
    }

    /**
     * Perform an attack move
     * @param {number} r - starting row
     * @param {number} c - starting col
     * @param {number} dir - direction of traversing
     * @param {Array<number>} cut - preferred ending position
     * @param {boolean} [saveSteps=true] - returns the intermediate steps of the move
     * @param {boolean} [perform=true] - whether to actual perform the move
     * @param {boolean} [noRespond=false] - whether to not consider this "move" for the turn
     */
    traverse (r, c, dir, cut, saveSteps = true, perform = true, noRespond = false) {
        if ((Directions.isHorizontal(dir) && (r === 0 || r === 5)) ||
            (Directions.isVertical(dir) && (c === 0 || c === 5))) {
            throw new Error(`${r}${c} cannot be looped in direction ${dir}, ends at corner`)
        }
        if (this.states[this.indexOf(r, c)] !== this.turnPlayer) {
            throw new Error("Not turning player's pebble")
        }

        const steps = findPath(this, r, c, dir, cut, !saveSteps && !perform)

        if (perform) {
            const lastPosition = steps[steps.length - 1]
            this.step(r, c, lastPosition.row, lastPosition.column, noRespond, true)
        }

        return steps
    }

    /**
     * Iterate over all positions with a callback that receives three arguments:
     * 1. Pebble state
     * 2. Row
     * 3. Column
     * @param {Function} callback
     */
    forEach (callback) {
        for (let i = 0, r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++, i++) {
                callback(this.states[i], r, c)
            }
        }
    }

    copyTo (surakarta) {
        for (let i = 0; i < 36; i++) {
            surakarta.states[i] = this.states[i]
        }
    }

    copyFrom (surakarta) {
        surakarta.copyTo(this)
    }

    /**
     * Clone this instance without the responders.
     *
     * @returns {Surakarta}
     */
    clone () {
        const clonedState = new Surakarta(true)

        for (let i = 0; i < 36; i++) {
            clonedState.states[i] = this.states[i]
        }

        clonedState.turn = this.turn
        return clonedState
    }

    /**  @private */
    _notifyRespondersOnTurn () {
        this.responders[2].forEach(responder => responder.onTurn())
        this.responders[this.turnPlayer].forEach(responder => responder.onTurn())
    }
}

/**
 * Generate a `Surakarta` instance with a predefined layout.
 *
 * @static
 * @param {Array<int>} states
 * @returns {Surakarta}
 */
Surakarta.fromState = function (states) {
    const instance = new Surakarta(true)

    for (let i = 0; i < 36; i++) {
        instance.states[i] = states[i]

        if (states[i] === RED_PLAYER) {
            ++instance.playerStats.red.pebbles
        } else if (states[i] === BLACK_PLAYER) {
            ++instance.playerStats.black.pebbles
        }
    }

    return instance
}

/**
 * @interface SurakartaResponder
 *
 * @method onTurn
 * @param {Surakarta} surakarta
 */
