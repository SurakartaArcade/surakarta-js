import TraverseUtils, { LEFT, UP, RIGHT, DOWN, Directions } from './traverse-utils'
import { validateStep } from './step-utils'

export const NOT_FILLED = -1
export const RED_PLAYER = 0 // starting player
export const BLACK_PLAYER = 1 // other player

/**
 * Handle the state of an actual Surakarta game.
 */
export class Surakarta {
    /**
     * Constructs a Surakarta board state with the pebbles in their initial
     * positions.
     * @param {boolean} [noInit=false] - whether not to initialize the board
     */
    constructor (noInit = false) {
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

    /**
     * The player whose turn it is currently.
     * @member {number}
     */
    get turnPlayer () {
        return (this.turn % 2)
    }

    /**
     * Perform a simple move on the board. Only validation that occurs is if the
     * destination is already filled or if it isn't the pebble's turn.
     * @param {number} rs - initial position row
     * @param {number} cs - intial position column
     * @param {number} rd - final position row
     * @param {number} cd - final position column
     * @param {boolean} [noRespond=false] - whether not to consider this a
     *  turning move, e.g. increment the current turn.
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

        this.states[id] = this.states[is]
        this.states[is] = NOT_FILLED

        if (!noRespond) {
            this.turn++
            this._notifyRespondersOnTurn()
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
     * Perform a traversing move
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

        const traverseStep = function (r, c, dir) {
            switch (dir) {
            case UP: {
                if (r !== 0) return [r - 1, c]
                break
            }
            case LEFT: {
                if (c !== 0) return [r, c - 1]
                break
            }
            case DOWN: {
                if (r !== 5) return [r + 1, c]
                break
            }
            case RIGHT:
                if (c !== 5) return [r, c + 1]

                return null
            }
        }
        const loopStep = TraverseUtils.getLoopTerminal
        const start = [r, c]
        const end = new Array(2)
        const pebble = this.states[this.indexOf(r, c)]
        const steps = saveSteps ? [] : true

        while (true) {
            let next = traverseStep(r, c, dir)

            if (!next) {
                next = loopStep(r, c)
                dir = next[2]
            }

            r = next[0]
            c = next[1]

            if (r === start[0] && c === start[1]) {
                return false // Infinite loop
            }

            const state = this.states[this.indexOf(r, c)]

            if (state === pebble) {
                return false // Can't move since no capture
            }
            if (saveSteps) {
                steps.push([r, c])
            }
            if ((cut && cut[0] === r && cut[1] === c) || state !== NOT_FILLED) {
                end[0] = r
                end[1] = c
                break
            }
        }

        if (perform) {
            this.step(start[0], start[1], end[0], end[1], noRespond, true)
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
 * @interface SurakartaResponder
 *
 * @method onTurn
 * @param {Surakarta} surakarta
 */
