import { useState } from 'react';
import { useAppState } from '../app/AppStateProvider';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './Button';
export function FirstTimeHelp() {
  const { state, problem, dispatch } = useAppState();
  const [requested, setRequested] = useState(false);
  const open = (requested || !state.onboardingSeen) && problem !== 'invalid' && problem !== 'conflict';
  function close() { dispatch({ type: 'seen-help' }); setRequested(false); }
  return <><Button variant="quiet" onClick={() => setRequested(true)}>How to play</Button><ConfirmDialog open={open} title="A little more world awaits" description="Choose an adventure, put your device away, and return to record what you found. Your coins celebrate effort — there is no rush." confirmLabel="Let's explore" cancelLabel="Close guide" onCancel={close} onConfirm={close}><ol className="help-steps"><li>Choose Bingo or a little quest.</li><li>Explore safely with an adult when appropriate. Indoor options count too.</li><li>Return to mark discoveries. Complete a quest, then claim its coins.</li></ol><p>Rewards are earned once. New boards keep your coins. Progress stays in this browser when saving is available.</p></ConfirmDialog></>;
}
