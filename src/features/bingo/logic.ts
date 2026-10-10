import type { BingoCell } from '../../app/state';
export const linePatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;
export function completedLines(cells: BingoCell[]) {
  return linePatterns.flatMap((line, index) => line.every((position) => cells[position]?.completed) ? [index] : []);
}
