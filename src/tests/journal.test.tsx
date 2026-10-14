import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../app/App';
import { appReducer } from '../app/reducer';
import { createInitialState } from '../app/state';
import { STORAGE_KEY } from '../persistence/storage';
import { journalDate } from '../components/AdventureJournal';

describe('Home adventure scrapbook', () => {
  it('shows three recent real achievements, expands history, and keeps the ledger intact', () => {
    let state = createInitialState(); state.onboardingSeen = true;
    for (const questId of ['leaf-trio', 'cloud-story', 'sound-map', 'plant-helper']) {
      state = appReducer(state, { type: 'start-quest', questId });
      state = appReducer(state, { type: 'complete-quest', questId });
    }
    state.completionRecords.forEach((record, index) => { record.completedAt = `2026-10-${10 + index}T10:00:00Z`; state.questProgress.find(quest => quest.questId === record.sourceId)!.completedAt = record.completedAt; });
    const raw = JSON.stringify(state); localStorage.setItem(STORAGE_KEY, raw);
    const app = render(<App/>);
    const journal = within(screen.getByRole('region', { name: 'Little discoveries' }));
    expect(journal.getAllByRole('listitem')).toHaveLength(3);
    expect(journal.getAllByRole('listitem')[0].textContent).toContain('A sip for a plant');
    expect(journal.getAllByRole('listitem')[0].querySelector('time')?.dateTime).toBe('2026-10-13T10:00:00Z');
    fireEvent.click(journal.getByRole('button', { name: 'See all' }));
    expect(journal.getAllByRole('listitem')).toHaveLength(4);
    fireEvent.click(journal.getByRole('button', { name: 'Show recent' }));
    expect(journal.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Collect my coins' }).getAttribute('href')).toBe('#/quests');
    expect(screen.getByTestId('coin-balance').textContent).toBe('0');
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    app.unmount(); render(<App/>);
    expect(within(screen.getByRole('region', { name: 'Little discoveries' })).getAllByRole('listitem')).toHaveLength(3);
  });
  it('handles missing and invalid dates gracefully', () => {
    expect(journalDate()).toBeUndefined(); expect(journalDate('invalid')).toBeUndefined();
    expect(journalDate('2026-10-14T10:00:00Z')).toBeTruthy();
  });
});
