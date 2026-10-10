import { useAppState } from '../../app/AppStateProvider';
import { BingoCell } from './BingoCell';
import { completedLines, linePatterns } from './logic';
export function BingoBoard() {
  const { state, dispatch, problem } = useAppState();
  const board = state.bingoBoard;
  const lines = completedLines(board.cells);
  return <div className="bingo-grid" aria-label="Nature Bingo board">{board.cells.map((cell, index) => <div className={`tile-slot ${lines.some((line) => (linePatterns[line] as readonly number[]).includes(index)) ? 'in-completed-line' : ''}`} key={`${board.id}:${cell.activityId}`}><BingoCell cell={cell} disabled={problem === 'conflict' || problem === 'invalid'} onToggle={() => dispatch({ type: 'toggle-cell', activityId: cell.activityId })} onClear={() => dispatch({ type: 'clear-cell', activityId: cell.activityId })} onDraw={(strokes) => dispatch({ type: 'draw-cell', activityId: cell.activityId, strokes })} /></div>)}</div>;
}
