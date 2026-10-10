import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import { avatars } from '../data/avatars';
import type { AvatarId } from '../data/avatars';
import { appReducer } from '../app/reducer';
import { createInitialState } from '../app/state';
import { validateState } from '../persistence/validation';
import { STORAGE_KEY } from '../persistence/storage';
describe('Home avatars', () => {
  it('updates every original image immediately and restores the selection with the profile', () => {
    const app = render(<App />);
    fireEvent.click(screen.getByText('Choose your explorer'));
    const options = within(screen.getByRole('group', { name: 'Explorer options' }));
    expect(options.getAllByRole('button')).toHaveLength(6);
    for (const avatar of avatars) {
      fireEvent.click(options.getByRole('button', { name: avatar.label }));
      expect(screen.getByRole('img', { name: avatar.alt }).getAttribute('src')).toBe(avatar.src);
      expect(options.getByRole('button', { name: avatar.label }).getAttribute('aria-pressed')).toBe('true');
      expect(options.getAllByRole('button').filter(button => button.getAttribute('aria-pressed') === 'true')).toHaveLength(1);
    }
    fireEvent.click(screen.getByRole('button', { name: 'Calm' }));
    fireEvent.click(screen.getByRole('button', { name: 'Home settings' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Robin' } });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
    app.unmount(); render(<App />);
    expect(screen.getByRole('img', { name: avatars[5].alt }).getAttribute('src')).toBe(avatars[5].src);
    expect(screen.getByRole('heading', { name: 'Robin' })).toBeTruthy();
    expect(screen.getByText('8 years old')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Calm' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('coin-balance').textContent).toBe('0');
    expect(validateState(JSON.parse(localStorage.getItem(STORAGE_KEY)!))).toBe(true);
  });
  it('supports old snapshots without avatars and rejects unknown IDs', () => {
    const state = createInitialState();
    expect(validateState(state)).toBe(true);
    expect(validateState({ ...state, homeProfile: { name: 'Robin', avatarId: 'other' } })).toBe(false);
    expect(appReducer(state, { type: 'set-avatar', avatarId: 'other' as AvatarId })).toBe(state);
    const next = appReducer(state, { type: 'set-avatar', avatarId: avatars[0].id });
    expect(appReducer(next, { type: 'set-avatar', avatarId: avatars[0].id })).toBe(next);
    expect(next.bingoBoard).toBe(state.bingoBoard);
    expect(next.questProgress).toBe(state.questProgress);
    expect(next.coinLedger).toBe(state.coinLedger);
  });
  it('uses existing unsaved-state feedback when avatar storage fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    render(<App />);
    fireEvent.click(screen.getByText('Choose your explorer'));
    fireEvent.click(screen.getByRole('button', { name: avatars[2].label }));
    expect(screen.getByRole('img', { name: avatars[2].alt })).toBeTruthy();
    expect(screen.getByText('Your progress is not saved')).toBeTruthy();
  });
});
