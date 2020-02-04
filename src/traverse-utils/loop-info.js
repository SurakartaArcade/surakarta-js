import { UP, LEFT, RIGHT, DOWN, Directions } from './Directions'

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

function angle (r0, c0, r1, c1) {
    if (r0 === r1) {
        return c1 > c0 ? 0 : Math.PI
    } else if (c1 === c0) {
        return r1 > r0 ? Math.PI / 2 : 1.5 * Math.PI
    }
}

/**
 * Calculates the angular rotation when looping from start to
 * end.
 * @param {number} startX
 * @param {number} startY
 * @param {number} endX
 * @param {number} endY
 */
export function getLoopRotation (startX, startY, endX, endY) {
    let cx

    if (endX === 0 || startX === 0) {
        cx = 0
    } else {
        cx = 5
    }

    let cy

    if (endY === 0 || startY === 0) {
        cy = 0
    } else {
        cy = 5
    }

    const startAngle = angle(cx, cy, startX, startY)
    const endAngle = angle(cx, cy, endX, endY)

    return [cx, cy, startAngle, endAngle, Math.abs(endX - startX)]
}

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
