import { describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../app/state';
import { appReducer } from '../app/reducer';
import { loadState, saveState, STORAGE_KEY } from '../persistence/storage';
import { validateState } from '../persistence/validation';

describe('local persistence', () => {
  it('loads missing storage as a fresh profile', () => {
    localStorage.clear();
    const result = loadState();
    expect(result.problem).toBeNull();
    expect(validateState(result.state)).toBe(true);
    expect(result.state.onboardingSeen).toBe(false);
  });
  it('round-trips board, rewards, quests, and onboarding', () => {
    let state = appReducer(createInitialState(), { type: 'seen-help' });
    for (const activityId of ['leaf', 'cloud', 'yellow']) state = appReducer(state, { type: 'toggle-cell', activityId });
    state = appReducer(state, { type: 'start-quest', questId: 'cloud-story' });
    state = appReducer(state, { type: 'complete-quest', questId: 'cloud-story' });
    state = appReducer(state, { type: 'claim-quest', questId: 'cloud-story' });
    saveState(state);
    expect(loadState()).toEqual({ state, raw: JSON.stringify(state), problem: null });
  });
  it.each(['{broken', 'null', '{"schemaVersion":99}'])('retains invalid raw data: %s', (raw) => {
    localStorage.setItem(STORAGE_KEY, raw);
    expect(loadState().problem).toBe('invalid');
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });
  it('rejects duplicate claims, incorrect amounts, missing records, and invalid cells', () => {
    let state = createInitialState();
    for (const activityId of ['leaf', 'cloud', 'yellow']) state = appReducer(state, { type: 'toggle-cell', activityId });
    const copy = () => structuredClone(state);
    const duplicate = copy(); duplicate.coinLedger.push({ ...duplicate.coinLedger[0] });
    expect(validateState(duplicate)).toBe(false);
    const amount = copy(); amount.coinLedger[0].amount = -1;
    expect(validateState(amount)).toBe(false);
    const inflated = copy(); inflated.coinLedger[0].amount = 100;
    expect(validateState(inflated)).toBe(false);
    const missing = copy(); missing.completionRecords = [];
    expect(validateState(missing)).toBe(false);
    const badCell = copy(); badCell.bingoBoard.cells[0].activityId = 'unknown';
    expect(validateState(badCell)).toBe(false);
    const badType = copy(); (badType.bingoBoard.cells as unknown[])[0] = null;
    expect(validateState(badType)).toBe(false);
  });
  it('handles blocked reads and reports failed writes', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
    expect(loadState().problem).toBe('unavailable');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    expect(() => saveState(createInitialState())).toThrow();
  });
});
