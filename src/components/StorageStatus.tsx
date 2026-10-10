import { useState } from 'react';
import { useAppState } from '../app/AppStateProvider';
import { Button } from './Button';
import { ConfirmDialog } from './ConfirmDialog';
export function StorageStatus() {
  const { problem, retry, recover, reload } = useAppState();
  const [confirm, setConfirm] = useState<'recover' | 'reload' | null>(null);
  if (!problem) return null;
  return <><section className="storage-status" role="alert">
    <h2>{problem === 'invalid' ? 'Your saved progress needs a little care' : problem === 'conflict' ? 'Progress changed in another tab' : 'Your progress is not saved'}</h2>
    <p>{problem === 'invalid' ? 'The saved data is unreadable or from an unsupported version. It has been left untouched. Activities are paused until you choose how to recover.' : problem === 'conflict' ? 'Activities are paused to avoid overwriting progress. Reloading uses the saved version and discards any unsaved changes in this tab.' : 'You can keep exploring here, but a refresh may lose these changes. Allow browser storage and try saving again.'}</p>
    {problem === 'unavailable' && <Button variant="secondary" onClick={retry}>Retry saving</Button>}
    {problem === 'invalid' && <Button variant="secondary" onClick={() => setConfirm('recover')}>Reset unreadable progress</Button>}
    {problem === 'conflict' && <Button variant="secondary" onClick={() => setConfirm('reload')}>Reload saved progress</Button>}
  </section><ConfirmDialog open={confirm !== null} title={confirm === 'recover' ? 'Start over in this browser?' : 'Use saved progress?'} description={confirm === 'recover' ? 'This replaces the unreadable local data with a fresh profile. Old marks, quest progress, and coins will be lost. This cannot be undone.' : 'This discards unsaved changes in this tab and loads the latest saved profile.'} confirmLabel={confirm === 'recover' ? 'Confirm reset' : 'Confirm reload'} cancelLabel="Cancel" onCancel={() => setConfirm(null)} onConfirm={() => { if (confirm === 'recover') recover(); else reload(); setConfirm(null); }} /></>;
}
