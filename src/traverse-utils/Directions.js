export const LEFT = 10
export const UP = 11
export const RIGHT = 12
export const DOWN = 13

export default {
    LEFT,
    UP,
    RIGHT,
    DOWN,
    isHorizontal: function (d) {
        return d === LEFT || d === RIGHT
    },
    isVertical: function (d) {
        return d === UP || d === DOWN
    },
    of: function (start, end) {
        const r = end[0] - start[0]
        const c = end[1] - start[1]

        if (r * c !== 0) {
            throw new Error(`(${start[0]}, ${start[1]}) to (${end[0]}, ${end[1]}) isn't an orthogonal direction`)
        }
        if (r !== 0) {
            return r > 0 ? DOWN : UP
        }
        if (c !== 0) {
            return c > 0 ? RIGHT : LEFT
        }

        throw new Error('No move made, and direction cannot be given to zero vector.')
    }
}
