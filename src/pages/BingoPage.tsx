import { useState } from 'react';
import { useAppState } from '../app/AppStateProvider';
import { BingoBoard } from '../features/bingo/BingoBoard';

import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
export function BingoPage() {
  const { state, dispatch } = useAppState();
  const [confirm, setConfirm] = useState(false);
  const count = state.bingoBoard.cells.filter((cell) => cell.completed).length;

  return <div className="bingo-page"><div className="page-title-row bingo-header"><div className="bingo-intro"><img src="/assets/home_icons/bingo_icon.png" alt="" width="1448" height="1086" /><div><h1>Nature Bingo</h1><p>Draw an X over each discovery.</p></div></div><Button className="reset-board" variant="secondary" aria-label="Start a new board" title="Start a new board" onClick={() => setConfirm(true)}><img src="/assets/global/Refresh_Arrow.png" alt=""/></Button></div>
    <section className="board-paper paper-surface" aria-label="Bingo adventure"><div className="board-heading"><span className="journal-label">LITTLE DISCOVERIES</span><span>{count} of 9 discoveries</span><progress className="sr-only" aria-label="Discoveries on this board" value={count} max={9} /></div><BingoBoard /></section>
    <div className="bingo-footnotes"><p className="bingo-safety"><img src="/assets/bingo_icons/star.png" alt="" aria-hidden="true"/><span><strong>Stay safe!</strong> Explore with a grown-up, look with your eyes, and don't touch animals or taste plants.</span></p></div>
    <ConfirmDialog open={confirm} title="A fresh page of discoveries?" description="This clears the marks and drawings on your board and rearranges the activities. Your coins, discoveries, and earned rewards stay. A new board does not give extra coin rewards." confirmLabel="Start a fresh board" cancelLabel="Keep my board" onCancel={() => setConfirm(false)} onConfirm={() => { dispatch({ type: 'new-board' }); setConfirm(false); }} />
  </div>;
}



