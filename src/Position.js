/**
 * @class
 * @namespace SK
 */
export class Position {
    constructor (row = 0, col = 0) {
        this.set(row, col)
    }

    set (row, col) {
        /** @member {number} */
        this.row = row

        /** @member {number} */
        this.column = col
    }

    index () {
        return this.row * 6 + this.column
    }
}
