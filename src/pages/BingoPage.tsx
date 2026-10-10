import { CoinIcon } from '../components/CoinIcon';
import { useState } from 'react';
import { useAppState } from '../app/AppStateProvider';
import { BingoBoard } from '../features/bingo/BingoBoard';
import { completedLines } from '../features/bingo/logic';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Icon } from '../components/Icon';
import { bingoActivities } from '../data/bingoActivities';
export function BingoPage() {
  const { state, dispatch } = useAppState();
  const [confirm, setConfirm] = useState(false);
  const count = state.bingoBoard.cells.filter((cell) => cell.completed).length;
  const lines = completedLines(state.bingoBoard.cells).length;
  return <div className="bingo-page"><div className="page-title-row"><div className="bingo-intro"><img src="/assets/home_icons/bingo_icon.png" alt="" width="1448" height="1086" /><div><h1>Nature Bingo</h1><p>Explore first. Then draw an X over each discovery.</p></div></div><Button variant="quiet" aria-label="New board" onClick={() => setConfirm(true)}><Icon name="undo" /><span className="button-label">New board</span></Button></div>
    <div className="drawing-hint"><span>Draw two crossing lines. A mouse, finger, or pen works.</span><span>Prefer a button? Tap <strong>Mark</strong> below a tile.</span></div>
    <section className="board-paper pixel-surface" aria-label="Bingo adventure"><div className="board-heading"><span className="pixel-label">LITTLE DISCOVERIES</span><span>{count} of 9 discoveries</span><progress className="sr-only" aria-label="Discoveries on this board" value={count} max={9} /></div><BingoBoard /><p className="board-caption" role="status">{count === 9 ? 'A whole board of wonders. You did it!' : lines > 0 ? `${lines} completed ${lines === 1 ? 'line' : 'lines'} â€” lovely exploring!` : 'Make a line across, down, or diagonally.'}</p></section>
    <div className="bingo-footnotes"><p><CoinIcon className="mini-coin" /> First line: 10 coins. First full board: 20 more. Earned once, even across new boards.</p><p>Explore somewhere safe, with an adult when appropriate. Look, don't taste plants or touch animals.</p><details><summary>Indoor ideas & drawing help</summary><p>Each X needs two diagonal strokes that cross. Tiny taps don't count. Undo a marked tile, or clear unfinished ink and try again. The Mark button works without drawing, with the same rewards.</p><ul>{bingoActivities.map((activity) => <li key={activity.id}><strong>{activity.label}:</strong> {activity.instruction}</li>)}</ul></details></div>
    <ConfirmDialog open={confirm} title="A fresh page of discoveries?" description="This clears the marks and drawings on your board and rearranges the activities. Your coins, discoveries, and earned rewards stay. A new board does not give extra coin rewards." confirmLabel="Start a fresh board" cancelLabel="Keep my board" onCancel={() => setConfirm(false)} onConfirm={() => { dispatch({ type: 'new-board' }); setConfirm(false); }} />
  </div>;
}



