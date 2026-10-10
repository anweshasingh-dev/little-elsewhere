import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import { createInitialState } from '../app/state';
import { STORAGE_KEY } from '../persistence/storage';

function openPage(hash: string) { window.history.replaceState(null, '', hash); return render(<App />); }
function coinCount() { return screen.getByTestId('coin-balance').textContent; }
function mark(label: string) { fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${label}:`) })); }

describe('MVP journeys', () => {
  it('restores bingo rewards across remount and prevents undo/reset duplicates', () => {
    const app = openPage('#/bingo');
    for (const label of ['Find a leaf', 'Spot a cloud', 'Something yellow']) mark(label);
    expect(coinCount()).toBe('10');
    expect(screen.getByRole('progressbar', { name: 'Discoveries on this board' }).getAttribute('value')).toBe('3');
    app.unmount();
    render(<App />);
    expect(coinCount()).toBe('10');
    expect(screen.getByRole('button', { name: /^Find a leaf:/ }).getAttribute('aria-pressed')).toBe('true');
    mark('Find a leaf'); mark('Find a leaf');
    expect(coinCount()).toBe('10');
    fireEvent.click(screen.getByRole('button', { name: 'New board' }));
    fireEvent.click(screen.getByRole('button', { name: 'Keep my board' }));
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('3');
    fireEvent.click(screen.getByRole('button', { name: 'New board' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start a fresh board' }));
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('0');
    expect(coinCount()).toBe('10');
    for (const button of screen.getAllByRole('button').filter((button) => button.hasAttribute('aria-pressed'))) fireEvent.click(button);
    expect(coinCount()).toBe('30');
    expect(screen.getByText('A whole board of wonders. You did it!')).toBeTruthy();
  });
  it('starts, completes, claims, and restores a quest without duplicate rewards', () => {
    const app = openPage('#/quests');
    const card = () => within(screen.getByRole('article', { name: 'Cloud daydreams' }));
    fireEvent.click(card().getByRole('button', { name: 'Start quest' }));
    fireEvent.click(card().getByRole('button', { name: 'Choose another time' }));
    fireEvent.click(card().getByRole('button', { name: 'Start quest' }));
    fireEvent.click(card().getByRole('button', { name: 'I did it!' }));
    expect(coinCount()).toBe('0');
    const claim = card().getByRole('button', { name: 'Claim 5 coins' });
    fireEvent.click(claim); fireEvent.click(claim);
    expect(coinCount()).toBe('5');
    app.unmount(); render(<App />);
    expect(coinCount()).toBe('5');
    expect(card().getByText('Completed')).toBeTruthy();
    expect(card().queryByRole('button', { name: /Claim/ })).toBeNull();
  });
  it('keeps malformed storage untouched until confirmed recovery', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    openPage('#/bingo');
    expect(screen.queryByRole('button', { name: /^Find a leaf:/ })).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{broken');
    fireEvent.click(screen.getByRole('button', { name: 'Reset unreadable progress' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{broken');
    fireEvent.click(screen.getByRole('button', { name: 'Reset unreadable progress' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm reset' }));
    fireEvent.click(screen.getByRole('button', { name: "Let's explore" }));
    expect(coinCount()).toBe('0');
    expect(screen.getByRole('button', { name: /^Find a leaf:/ })).toBeTruthy();
  });
  it('shows unsaved progress and retries the latest state without duplicate awards', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    openPage('#/bingo');
    for (const label of ['Find a leaf', 'Spot a cloud', 'Something yellow']) mark(label);
    expect(coinCount()).toBe('10');
    expect(screen.getByText('Your progress is not saved')).toBeTruthy();
    write.mockRestore();
    fireEvent.click(screen.getByRole('button', { name: 'Retry saving' }));
    expect(screen.queryByText('Your progress is not saved')).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).coinLedger).toHaveLength(1);
  });
  it('pauses when another tab changes storage and confirms reload', () => {
    openPage('#/bingo');
    const newer = createInitialState(); newer.onboardingSeen = true;
    const raw = JSON.stringify(newer);
    localStorage.setItem(STORAGE_KEY, raw);
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: raw })));
    expect(screen.getByText('Progress changed in another tab')).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Find a leaf:/ }).closest('fieldset')?.disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Reload saved progress' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm reload' }));
    expect(screen.queryByText('Progress changed in another tab')).toBeNull();
    mark('Find a leaf');
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('1');
  });
  it('explains the first-time loop and lets the guide reopen', () => {
    localStorage.clear();
    openPage('#/');
    expect(screen.getByRole('dialog', { name: 'A little more world awaits' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: "Let's explore" }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).onboardingSeen).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'How to play' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Close guide' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('shows empty progress and locked milestones without extra rewards', () => {
    openPage('#/progress');
    expect(screen.getByText('Your first discovery is waiting')).toBeTruthy();
    expect(screen.getAllByText('STILL TO EXPLORE')).toHaveLength(3);
    expect(coinCount()).toBe('0');
  });
});