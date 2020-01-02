import Directions from './Directions'

/**
 * Calculates the radius of the loop that this point lies on in the given
 * direction.
 * @param {number} dir
 * @param {number} r
 * @param {number} c
 */
export function getLoopRadius (dir, r, c) {
    if (dir === Directions.LEFT || dir === Directions.RIGHT) {
        return (r < 3) ? r : 5 - r
    } else {
        return (c < 3) ? c : 5 - c
    }
}
