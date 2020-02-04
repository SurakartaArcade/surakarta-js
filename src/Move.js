/**
 * Represents a move that can be made in Surakarta.
 */
export class Move {
    constructor (srcRow = 0, srcColumn = 0, dstRow = 0, dstColumn = 0, isAttack = false, direction = -1) {
        /**
         * Row of source/starting position.
         * @member {number}
         */
        this.srcRow = srcRow

        /**
         * Column of source/starting position.
         * @member {number}
         */
        this.srcColumn = srcColumn

        /**
         * Row of destination/final position.
         * @member {number}
         */
        this.dstRow = dstRow

        /**
         * Column of destination/final position.
         * @member {number}
         */
        this.dstColumn = dstColumn

        /**
         * Whether this move is an attack (need not be a capture).
         * @member {boolean}
         */
        this.isAttack = isAttack

        /**
         * Starting direction, if attack move
         * @member {Direction}
         */
        this.direction = direction
    }

    makeAttack (direction) {
        this.isAttack = true
        this.direction = direction
    }

    /**
     * @param {number} row
     * @param {number} column
     */
    setSource (row, column) {
        this.srcRow = row
        this.srcColumn = column
    }

    /**
     * @param {number} row
     * @param {number} column
     */
    setDestination (row, column) {
        this.dstRow = row
        this.dstColumn = column
        return this
    }

    /**
     * Generate an exact copy of this move.
     * @returns {Move}
     */
    clone () {
        return new Move(
            this.srcRow,
            this.srcColumn,
            this.dstRow,
            this.dstColumn,
            this.isAttack,
            this.direction
        )
    }
}

export default Move
