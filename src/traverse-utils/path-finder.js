import { LEFT, UP, RIGHT, DOWN } from './Directions'
import { getLoopTerminal } from './loop-info'

const NOT_FILLED = -1

/**
 * @typedef {Array} TraverseContext
 * @property {number} 0 - row
 * @property {number} 1 - column
 * @property {Direction?} 2 - direction
 * @property {number} row
 * @property {number} column
 * @property {Direction} direction
 */

export function simpleStepContext (row, column) {
    const context = [row, column]
    context.row = row
    context.column = column
    return context
}

export function loopStepContext (row, column, direction) {
    const context = [row, column, direction]
    context.row = row
    context.column = column
    context.direction = direction
    context.isLoop = true
    return context
}

function findSimpleStep (row, column, direction) {
    switch (direction) {
    case UP:
        if (row !== 0) {
            return [row - 1, column]
        }
        break
    case LEFT:
        if (column !== 0) {
            return [row, column - 1]
        }
        break
    case DOWN:
        if (row !== 5) {
            return [row + 1, column]
        }
        break
    case RIGHT:
        if (column !== 5) {
            return [row, column + 1]
        }
        break
    }

    return null
}

/**
 * Finds the next position that the attack will land on, if continuable.
 * @returns {TraverseContext}
 */
export function findStep (row, column, direction) {
    const simpleStep = findSimpleStep(row, column, direction)

    if (simpleStep) {
        simpleStep.row = simpleStep[0]
        simpleStep.column = simpleStep[1]
        return simpleStep
    } else {
        const loopStep = getLoopTerminal(row, column)
        loopStep.row = loopStep[0]
        loopStep.column = loopStep[1]
        loopStep.direction = loopStep[2]
        loopStep.isLoop = true
        return loopStep
    }
}

/**
 * Finds all the steps in the attack.
 * @param {Surakarta} surakarta
 * @param {number} row
 * @param {number} column
 * @param {Direction} direction
 * @param {Position} cut
 * @param {boolean} [findPossiblity=false]
 * @returns {Array<TraverseContext> | boolean}
 */
export function findPath (surakarta, row, column, direction, cut, findPossiblity = false) {
    const start = [row, column]
    const pebble = surakarta.states[surakarta.indexOf(row, column)]
    const steps = findPossiblity ? true : []
    let selfTouch = 0
    let loops = 0
    let cutFound = false

    while (true) {
        const next = findStep(row, column, direction)

        row = next[0]
        column = next[1]

        if (next.isLoop) {
            direction = next.direction
        }

        let self = false
        if (row === start[0] && column === start[1]) {
            ++selfTouch
            if (selfTouch > 1) {
                return false // Infinite loop
            }
            self = true
        }

        const state = surakarta.state(row, column)

        if (!self && state === pebble) {
            return false // can't capture our own pebble :)
        }
        if (!findPossiblity) {
            steps.push(next)

            if (next.length === 3) { // loop
                ++loops
                steps[steps.length - 1].isLoop = true
            }
        }
        if ((cut && cut.row === row && cut.column === column) || (!self && state !== NOT_FILLED)) {
            cutFound = (state === NOT_FILLED) // landed optional intermediate if current position not filled
            break
        }
    }

    if (loops === 0) {
        return false
    }

    steps.isCapture = !cutFound
    return steps
}

/**
 * @namespace SK
 */
export const PathFinder = {
    findStep,
    findPath
}
