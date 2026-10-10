import type { AppState } from '../app/state';
import { accessibleX } from '../features/bingo/drawing';

// Compatible schema-v1 extension. Only fill absent ink after the original snapshot validates.
// Leave the raw stored snapshot unchanged until the next user action successfully saves.
export function upgradeDrawing(state: AppState): AppState {
  if (state.bingoBoard.cells.every((cell) => cell.strokes !== undefined)) return state;
  return { ...state, bingoBoard: { ...state.bingoBoard,
    cells: state.bingoBoard.cells.map((cell) => ({ ...cell, strokes: cell.strokes ?? (cell.completed ? accessibleX() : []) })) } };
}
