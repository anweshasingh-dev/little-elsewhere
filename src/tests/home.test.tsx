import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import { createInitialState } from '../app/state';
import { appReducer } from '../app/reducer';
import { validateState } from '../persistence/validation';
import { STORAGE_KEY } from '../persistence/storage';
describe('Home profile', () => {
  it('persists mood and profile across refresh without changing rewards', () => {
    const app = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Calm' }));
    expect(screen.getByRole('button', { name: 'Calm' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Home settings' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Robin' } });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
    app.unmount(); render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Robin');
    expect(screen.getByText('8 years old')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Calm' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('coin-balance').textContent).toBe('0');
    expect(validateState(JSON.parse(localStorage.getItem(STORAGE_KEY)!))).toBe(true);
  });
  it('accepts legacy snapshots and rejects invalid profile data', () => {
    const state = createInitialState();
    expect(validateState(state)).toBe(true);
    for (const homeProfile of [{ name: 'Robin', mood: 'unknown' }, { name: 'Robin', age: 3.5 }, { name: 5 }]) {
      expect(validateState({ ...state, homeProfile })).toBe(false);
    }
    expect(appReducer(state, { type: 'set-home-profile', name: 'Robin', age: 100 })).toBe(state);
    const next = appReducer(state, { type: 'set-mood', mood: 'happy' });
    expect(appReducer(next, { type: 'set-mood', mood: 'happy' })).toBe(next);
  });
  it('retains unsaved mood in memory and shows the existing storage warning', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Tired' }));
    expect(screen.getByRole('button', { name: 'Tired' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('Your progress is not saved')).toBeTruthy();
  });
});
