import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import { createInitialState } from '../app/state';
import { STORAGE_KEY } from '../persistence/storage';

function openPage(hash: string) { window.history.replaceState(null, '', hash); return render(<App />); }
function coinCount() { return screen.getByTestId('coin-balance').textContent; }
function mark(label: string) {
  const undo = screen.queryByRole('button', { name: new RegExp(`^${label}:`) });
  if (undo) { fireEvent.click(undo); return; }
  const svg = screen.getByRole('img', { name: `Draw an X for ${label}` });
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100));
  for (const [start, end] of [[[20, 20], [80, 80]], [[20, 80], [80, 20]]]) {
    fireEvent.pointerDown(svg, { pointerId: 1, isPrimary: true, button: 0, clientX: start[0], clientY: start[1] });
    fireEvent.pointerUp(svg, { pointerId: 1, isPrimary: true, button: 0, clientX: end[0], clientY: end[1] });
  }
}

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
    fireEvent.click(screen.getByRole('button', { name: 'Start a new board' }));
    fireEvent.click(screen.getByRole('button', { name: 'Keep my board' }));
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('3');
    fireEvent.click(screen.getByRole('button', { name: 'Start a new board' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start a fresh board' }));
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('0');
    expect(coinCount()).toBe('10');
    for (const svg of screen.getAllByRole('img', { name: /^Draw an X for / })) mark(svg.getAttribute('aria-label')!.replace('Draw an X for ', ''));
    expect(coinCount()).toBe('30');
    expect(screen.queryByText('A whole board of wonders. You did it!')).toBeNull();
  });
  it('starts, completes, claims, and restores a quest without duplicate rewards', () => {
    const app = openPage('#/quests');
    const card = () => within(screen.getByRole('article', { name: 'Cloud daydreams' }));
    expect(card().getByText('Choose').closest('li')?.getAttribute('aria-current')).toBe('step');
    fireEvent.click(card().getByRole('button', { name: 'Start quest' }));
    expect(card().getByText('Explore').closest('li')?.getAttribute('aria-current')).toBe('step');
    fireEvent.click(card().getByRole('button', { name: 'Choose another time' }));
    fireEvent.click(card().getByRole('button', { name: 'Start quest' }));
    fireEvent.click(card().getByRole('button', { name: 'I did it!' }));
    expect(card().getByText('Collect').closest('li')?.getAttribute('aria-current')).toBe('step');
    expect(coinCount()).toBe('0');
    const claim = card().getByRole('button', { name: 'Claim 5 coins' });
    fireEvent.click(claim); fireEvent.click(claim);
    expect(coinCount()).toBe('5');
    app.unmount(); render(<App />);
    expect(coinCount()).toBe('5');
    expect(card().getByText('Completed')).toBeTruthy();
    expect(card().queryAllByRole('listitem').every(item => item.classList.contains('stage-done'))).toBe(true);
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
    expect(screen.getByRole('img', { name: 'Draw an X for Find a leaf' })).toBeTruthy();
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
    expect(screen.getByRole('img', { name: 'Draw an X for Find a leaf' }).closest('fieldset')?.disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Reload saved progress' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm reload' }));
    expect(screen.queryByText('Progress changed in another tab')).toBeNull();
    mark('Find a leaf');
    expect(screen.getByRole('progressbar').getAttribute('value')).toBe('1');
  });
  it('explains the first-time loop and provides instructions in settings', () => {
    localStorage.clear();
    openPage('#/');
    expect(screen.getByRole('dialog', { name: 'A little more world awaits' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: "Let's explore" }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).onboardingSeen).toBe(true);
    expect(screen.queryByRole('button', { name: 'How to play' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Home settings' }));
    expect(screen.getByRole('dialog', { name: 'Your explorer' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'How to play' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('shows empty progress and locked milestones without extra rewards', () => {
    openPage('#/progress');
    expect(screen.getByText('Your first discovery is waiting')).toBeTruthy();
    expect(screen.getAllByText('STILL TO EXPLORE')).toHaveLength(3);
    expect(coinCount()).toBe('0');
  });
});