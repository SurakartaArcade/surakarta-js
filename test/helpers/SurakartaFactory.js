const { Surakarta } = require("../../lib/Surakarta");

/**
 * An instruction that tells {@code writeSurakarta} what to write into the
 * {@code SK.Surakarta} state.
 *
 * A fairly simple instruction would be to place a {@code pebble} on a
 * given {@code row}x{@code column} positions; to combine many of these
 * instructions for adjacent positions, you can use the {@code rowRange} and
 * {@code columnRange} properties.
 *
 * To create a hole in a pebble "block", simply append an instruction to
 * add a {@code SK.NOT_FILLED} at the required position.
 *
 * @typedef {object} FactoryInstr
 * @member {SK.RED_PLAYER | SK.BLACK_PLAYER | SK.NOT_FILLED} pebble - pebble to place
 * @member {number} row - row to place pebble on
 * @member {number} column - column to place pebble on
 * @member {Array<number>} rowRange - range of rows to place pebble on (overrides {@code row})
 * @member {Array<number>} columnRange - range of columns to place pebble on (overrides {@code column})
 */

/**
 * Writes a {@code SK.Surakarta} game state based off the array of instructions
 * given (in order).
 *
 * @param {FactoryInstr} inst - instructions for building the game state
 * @returns {SK.Surakarta} built game state
 */
export function writeSurakarta(inst) {
  const mockSurakarta = new Surakarta();

  for (let i = 0; i < inst.length; i++) {
    const el = inst[i];
    const pebble = el.pebble;

    if (el.rowRange || el.columnRange) {
      const rowRange = el.rowRange || [el.row];
      const columnRange = el.columnRange || [el.column];

      for (let ri = 0; ri < rowRange.length; ri++) {
        for (let ci = 0; ci < columnRange.length; ci++) {
          mockSurakarta.states[rowRange[ri] * 6 + columnRange[ci]] = pebble;
        }
      }
    } else {
      mockSurakarta.states[el.row * 6 + el.column] = pebble;
    }
  }

  return mockSurakarta;
}
