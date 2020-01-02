import Directions from './Directions'

/**
 * Calculates the direction of the tangent to the loop (geometrically) emerging
 * from the given point.
 * @param {number} r
 * @param {number} c
 */
export function getLoopTangent (r, c) {
    if ((r === c || r === 5 - c) && (r === 0 || r === 5)) {
        throw new Error(`(${r}, ${c}) is a corner, not a loop terminal`)
    }

    if (r === 0) {
        return Directions.UP
    } else if (r === 5) {
        return Directions.DOWN
    } else if (c === 0) {
        return Directions.LEFT
    } else if (c === 5) {
        return Directions.RIGHT
    } else {
        throw new Error(`(${r}, ${c}) is not a loop terminal position.`)
    }
}
