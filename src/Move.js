// @flow

/**
 * Represents a move that can be made in Surakarta.
 */
export class Move {
  srcRow: number;
  srcColumn: number;
  dstRow: number;
  dstColumn: number;
  isAttack: boolean;
  direction: number;

  constructor(
    srcRow: number = 0,
    srcColumn: number = 0,
    dstRow: number = 0,
    dstColumn: number = 0,
    isAttack: boolean = false,
    direction: number = -1
  ) {
    /**
     * Row of source/starting position.
     * @member {number}
     */
    this.srcRow = srcRow;

    /**
     * Column of source/starting position.
     * @member {number}
     */
    this.srcColumn = srcColumn;

    /**
     * Row of destination/final position.
     * @member {number}
     */
    this.dstRow = dstRow;

    /**
     * Column of destination/final position.
     * @member {number}
     */
    this.dstColumn = dstColumn;

    /**
     * Whether this move is an attack (need not be a capture).
     * @member {boolean}
     */
    this.isAttack = isAttack;

    /**
     * Starting direction, if attack move
     * @member {Direction}
     */
    this.direction = direction;
  }

  makeAttack(direction: number) {
    this.isAttack = true;
    this.direction = direction;
  }

  /**
   * @param {number} row
   * @param {number} column
   */
  setSource(row: number, column: number) {
    this.srcRow = row;
    this.srcColumn = column;
  }

  /**
   * @param {number} row
   * @param {number} column
   */
  setDestination(row: number, column: number) {
    this.dstRow = row;
    this.dstColumn = column;
    return this;
  }

  /**
   * Generate an exact copy of this move.
   * @returns {Move}
   */
  clone(): Move {
    return Move.postThreadBoundary(this);
  }

  /**
   * Repairs a {@code Move} object after it has been copied through a
   * web-worker boundary.
   *
   * @param {Move} move
   */
  static postThreadBoundary(move: Move): Move {
    const cmove = new Move();

    cmove.srcRow = move.srcRow;
    cmove.srcColumn = move.srcColumn;
    cmove.dstRow = move.dstRow;
    cmove.dstColumn = move.dstColumn;
    cmove.isAttack = move.isAttack;
    cmove.direction = move.direction;

    return cmove;
  }
}

export default Move;
