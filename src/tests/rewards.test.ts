import { describe, expect, it } from 'vitest';
import { appReducer } from '../app/reducer';
import { coinBalance, createInitialState } from '../app/state';
import { completedLines, linePatterns } from '../features/bingo/logic';
import { award } from '../features/rewards/award';
import { quests } from '../data/quests';
import { validateState } from '../persistence/validation';

describe('bingo rewards', () => {
  it.each(linePatterns.map((line, index) => ({ line, index })))('recognizes line $index and pays only the first line', ({ line, index }) => {
    let state = createInitialState();
    for (const position of line) state = appReducer(state, { type: 'toggle-cell', activityId: state.bingoBoard.cells[position].activityId });
    expect(completedLines(state.bingoBoard.cells)).toContain(index);
    expect(coinBalance(state)).toBe(10);
    expect(state.bingoBoard.celebratedLines).toEqual([index]);
    expect(validateState(state)).toBe(true);
  });
  it('does not pay for incomplete boards or forged source IDs', () => {
    let state = createInitialState();
    state = appReducer(state, { type: 'toggle-cell', activityId: 'leaf' });
    state = appReducer(state, { type: 'toggle-cell', activityId: 'cloud' });
    expect(coinBalance(state)).toBe(0);
    expect(award(state, 'bingo-full', state.bingoBoard.id, new Date().toISOString())).toBe(state);
    expect(award(state, 'bingo-line', 'forged', new Date().toISOString())).toBe(state);
  });
  it('pays 30 total, remembers all lines, and never pays for undo or new boards', () => {
    let state = createInitialState();
    for (const cell of state.bingoBoard.cells) state = appReducer(state, { type: 'toggle-cell', activityId: cell.activityId });
    expect(coinBalance(state)).toBe(30);
    expect(state.bingoBoard.celebratedLines).toHaveLength(8);
    const restored = JSON.parse(JSON.stringify(state));
    state = appReducer(restored, { type: 'toggle-cell', activityId: 'leaf' });
    state = appReducer(state, { type: 'toggle-cell', activityId: 'leaf' });
    expect(coinBalance(state)).toBe(30);
    expect(state.bingoBoard.celebratedLines).toHaveLength(8);
    state = appReducer(state, { type: 'new-board' });
    expect(state.bingoBoard.cells.every((cell) => !cell.completed)).toBe(true);
    expect(state.bingoFoundIds).toHaveLength(9);
    for (const cell of state.bingoBoard.cells) state = appReducer(state, { type: 'toggle-cell', activityId: cell.activityId });
    expect(coinBalance(state)).toBe(30);
    expect(validateState(state)).toBe(true);
  });
  it('grants both awards if a final square completes the first line and board together', () => {
    // Normal play must already have a line at eight marks. Check central award composition directly.
    let state = createInitialState();
    state.bingoBoard.cells.forEach((cell) => { cell.completed = true; });
    state = award(state, 'bingo-line', state.bingoBoard.id, new Date().toISOString());
    state = award(state, 'bingo-full', state.bingoBoard.id, new Date().toISOString());
    expect(coinBalance(state)).toBe(30);
  });
});

describe('quest lifecycle and economy', () => {
  it('contains eight unique quests and the approved 75-coin allocation', () => {
    expect(quests).toHaveLength(8);
    expect(new Set(quests.map((quest) => quest.id)).size).toBe(8);
    expect(quests.reduce((sum, quest) => sum + quest.coinReward, 0)).toBe(75);
    expect(quests.every((quest) => quest.completionInstruction && quest.alternative && quest.duration)).toBe(true);
  });
  it('rejects early claims, supports abandon/restart, and grants each quest once', () => {
    let state = createInitialState();
    expect(appReducer(state, { type: 'claim-quest', questId: quests[0].id })).toBe(state);
    expect(appReducer(state, { type: 'complete-quest', questId: quests[0].id })).toBe(state);
    for (const quest of quests) {
      state = appReducer(state, { type: 'start-quest', questId: quest.id });
      state = appReducer(state, { type: 'abandon-quest', questId: quest.id });
      expect(state.questProgress.find((item) => item.questId === quest.id)?.status).toBe('available');
      state = appReducer(state, { type: 'start-quest', questId: quest.id });
      state = appReducer(state, { type: 'complete-quest', questId: quest.id });
      expect(validateState(state)).toBe(true);
      state = appReducer(state, { type: 'claim-quest', questId: quest.id });
      expect(validateState(state)).toBe(true);
      expect(appReducer(state, { type: 'claim-quest', questId: quest.id })).toBe(state);
      expect(appReducer(state, { type: 'start-quest', questId: quest.id })).toBe(state);
    }
    expect(coinBalance(state)).toBe(75);
    for (const cell of state.bingoBoard.cells) state = appReducer(state, { type: 'toggle-cell', activityId: cell.activityId });
    expect(coinBalance(state)).toBe(105);
    expect(state.coinLedger).toHaveLength(10);
    expect(validateState(state)).toBe(true);
  });
});
