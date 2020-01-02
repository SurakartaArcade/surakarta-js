import { UP, LEFT, RIGHT, DOWN } from './Directions'
import { getLoopRadius } from './getLoopRadius'
import { getLoopTangent } from './getLoopTangent'

/**
 * Calculates the point on which a point will land on after looping through
 * a loop from a terminal point.
 * @param {number} r
 * @param {number} c
 * @param {Array<number>} [loc_]
 */
export function getLoopTerminal (r, c, loc_) {
    const loc = loc_ || new Array(3)
    const tangent = getLoopTangent(r, c)
    const loopRadius = getLoopRadius(tangent, r, c)

    switch (tangent) {
    case UP:
        loc[0] = loopRadius
        loc[1] = (c < 3) ? 0 : 5
        loc[2] = loc[1] === 0 ? RIGHT : LEFT
        break
    case DOWN:
        loc[0] = 5 - loopRadius
        loc[1] = (c < 3) ? 0 : 5
        loc[2] = loc[1] === 0 ? RIGHT : LEFT
        break
    case LEFT:
        loc[0] = (r < 3) ? 0 : 5
        loc[1] = loopRadius
        loc[2] = loc[0] === 0 ? DOWN : UP
        break
    case RIGHT:
        loc[0] = (r < 3) ? 0 : 5
        loc[1] = 5 - loopRadius
        loc[2] = loc[1] === 0 ? DOWN : UP
        break
    }

    return loc
}
