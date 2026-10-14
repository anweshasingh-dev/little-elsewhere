import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import { appReducer } from '../app/reducer';
import { coinBalance, createInitialState } from '../app/state';
import { accessibleX, hasValidX, normalizePoint, validStrokes } from '../features/bingo/drawing';
import { loadState, STORAGE_KEY } from '../persistence/storage';
import { validateState } from '../persistence/validation';
import type { Stroke } from '../features/bingo/drawing';

if (!window.PointerEvent) {
  class TestPointerEvent extends MouseEvent {
    pointerId: number; isPrimary: boolean; pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init); this.pointerId = init.pointerId ?? 1; this.isPrimary = init.isPrimary ?? true; this.pointerType = init.pointerType ?? 'mouse';
    }
  }
  Object.defineProperty(window, 'PointerEvent', { value: TestPointerEvent });
}
const diagonals = accessibleX();
function openBingo() { window.history.replaceState(null, '', '#/bingo'); return render(<App />); }
function surface() {
  const svg = screen.getByRole('img', { name: 'Draw an X for Find a leaf' });
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 200, 200));
  return svg;
}
function draw(svg: HTMLElement | SVGElement, stroke: Stroke, pointerType = 'mouse', pointerId = 1) {
  const event = (point: [number, number]) => ({ clientX: point[0] * 2, clientY: point[1] * 2, pointerId, pointerType, isPrimary: true, button: 0 });
  fireEvent.pointerDown(svg, event(stroke[0]));
  for (const point of stroke.slice(1)) fireEvent.pointerMove(svg, event(point));
  fireEvent.pointerUp(svg, event(stroke[stroke.length - 1]));
}
function saved() { return JSON.parse(localStorage.getItem(STORAGE_KEY)!); }

describe('deliberate X recognition', () => {
  it('accepts two crossing diagonals in either direction', () => {
    expect(hasValidX(diagonals)).toBe(true);
    expect(hasValidX(diagonals.map((stroke) => [...stroke].reverse()))).toBe(true);
  });
  it('rejects taps, tiny lines, single diagonals, parallel strokes, and disjoint diagonals', () => {
    expect(hasValidX([[[10, 10], [10, 10]]])).toBe(false);
    expect(hasValidX([[[45, 45], [50, 50]], [[50, 45], [45, 50]]])).toBe(false);
    expect(hasValidX([diagonals[0]])).toBe(false);
    expect(hasValidX([diagonals[0], diagonals[0]])).toBe(false);
    expect(hasValidX([[[0, 0], [25, 25]], [[75, 25], [100, 0]]])).toBe(false);
  });
  it('clamps ink to its tile and validates bounded payloads', () => {
    expect(normalizePoint(-20, 250, { left: 0, top: 0, width: 100, height: 100 })).toEqual([0, 100]);
    expect(validStrokes([[[0, 0], [100, 100]]])).toBe(true);
    expect(validStrokes([[[NaN, 0], [1, 1]]])).toBe(false);
    expect(validStrokes([[[101, 0], [1, 1]]])).toBe(false);
    expect(validStrokes([Array.from({ length: 129 }, () => [0, 0])])).toBe(false);
    expect(validStrokes(Array.from({ length: 13 }, () => [[0, 0], [10, 10]]))).toBe(false);
  });
});

describe('pointer drawing and accessible completion', () => {
  it.each(['mouse', 'touch', 'pen'])('draws real %s strokes and preserves them on reload', (pointerType) => {
    const app = openBingo(); const svg = surface();
    draw(svg, diagonals[0], pointerType);
    expect(saved().bingoBoard.cells[0].completed).toBe(false);
    expect(saved().bingoBoard.cells[0].strokes).toHaveLength(1);
    draw(svg, diagonals[1], pointerType);
    expect(saved().bingoBoard.cells[0].completed).toBe(true);
    expect(saved().bingoBoard.cells[0].strokes).toEqual(diagonals);
    expect(svg.querySelectorAll('polyline')).toHaveLength(2);
    app.unmount(); render(<App />);
    expect(screen.getByRole('button', { name: /^Find a leaf:/ }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('img', { name: 'Draw an X for Find a leaf' }).querySelectorAll('polyline')).toHaveLength(2);
  });
  it('keeps palette marks stable through refresh, undo, and re-completion with icon-only undo', () => {
    const app = openBingo();
    const labels = ['Find a leaf', 'Spot a cloud', 'Something yellow', 'Notice a bird', 'Find a flower'];
    const colors = ['rgb(185, 204, 137)', 'rgb(182, 214, 213)', 'rgb(238, 208, 89)', 'rgb(175, 193, 112)', 'rgb(112, 192, 184)'];
    labels.forEach((label, index) => {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${label}:`) }));
      const undo = screen.getByRole('button', { name: new RegExp(`^${label}:.*Undo completion`) });
      expect(undo.textContent).toBe('');
      expect(undo.title).toBe('Undo completion');
      const mark = screen.getByRole('img', { name: `Draw an X for ${label}` }).querySelector('polyline');
      expect(mark?.getAttribute('style')).toContain(colors[index]);
    });
    app.unmount(); render(<App />);
    const mark = () => screen.getByRole('img', { name: 'Draw an X for Find a leaf' });
    expect(mark().querySelector('polyline')?.getAttribute('style')).toContain(colors[0]);
    fireEvent.click(screen.getByRole('button', { name: /^Find a leaf:/ }));
    expect(mark().querySelectorAll('polyline')).toHaveLength(0);
    expect(saved().bingoBoard.cells[0].completed).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: /^Find a leaf:/ }));
    expect(mark().querySelector('polyline')?.getAttribute('style')).toContain(colors[0]);
    expect(coinBalance(saved())).toBe(10);
  });
  it('taps artwork to toggle but does not toggle after a drawing gesture', () => {
    openBingo(); const svg = surface();
    fireEvent.click(svg);
    expect(saved().bingoBoard.cells[0].completed).toBe(true);
    fireEvent.click(svg);
    expect(saved().bingoBoard.cells[0].completed).toBe(false);
    draw(svg, diagonals[0]); fireEvent.click(svg);
    expect(saved().bingoBoard.cells[0].completed).toBe(false);
    expect(saved().bingoBoard.cells[0].strokes).toHaveLength(1);
    draw(svg, diagonals[1]); fireEvent.click(svg);
    expect(saved().bingoBoard.cells[0].completed).toBe(true);
    expect(saved().bingoBoard.cells[0].strokes).toHaveLength(2);
  });
  it('ignores taps and canceled strokes without completing or saving ink', () => {
    openBingo(); const svg = surface();
    draw(svg, [[10, 10], [10, 10]]);
    expect(saved().bingoBoard.cells[0].strokes).toEqual([]);
    fireEvent.pointerDown(svg, { pointerId: 1, button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(svg, { pointerId: 1, clientX: 160, clientY: 160 });
    fireEvent.pointerCancel(svg, { pointerId: 1 });
    expect(svg.querySelectorAll('polyline')).toHaveLength(0);
    expect(saved().bingoBoard.cells[0].completed).toBe(false);
  });
  it('can clear partial ink and use Mark/Undo without drawing', () => {
    openBingo(); const svg = surface(); draw(svg, diagonals[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Clear drawing for Find a leaf' }));
    expect(saved().bingoBoard.cells[0].strokes).toEqual([]);
    fireEvent.click(screen.getByRole('button', { name: /^Find a leaf:/ }));
    expect(saved().bingoBoard.cells[0].completed).toBe(true);
    expect(saved().bingoBoard.cells[0].strokes).toEqual(accessibleX());
    fireEvent.click(screen.getByRole('button', { name: /^Find a leaf:/ }));
    expect(saved().bingoBoard.cells[0].strokes).toEqual([]);
  });
});

describe('drawing rewards and legacy saves', () => {
  it('uses the existing ledger and cannot reward re-drawing or duplicate submission', () => {
    let state = createInitialState();
    for (const activityId of ['leaf', 'cloud', 'yellow']) state = appReducer(state, { type: 'draw-cell', activityId, strokes: diagonals });
    expect(coinBalance(state)).toBe(10);
    expect(validateState(state)).toBe(true);
    expect(appReducer(state, { type: 'draw-cell', activityId: 'leaf', strokes: diagonals })).toBe(state);
    state = appReducer(state, { type: 'clear-cell', activityId: 'leaf' });
    state = appReducer(state, { type: 'draw-cell', activityId: 'leaf', strokes: diagonals });
    expect(coinBalance(state)).toBe(10);
    expect(state.bingoBoard.celebratedLines).toHaveLength(1);
    expect(state.coinLedger).toHaveLength(1);
  });
  it('upgrades absent legacy ink without losing rewards or modifying storage on load', () => {
    let state = createInitialState();
    for (const activityId of ['leaf', 'cloud', 'yellow']) state = appReducer(state, { type: 'toggle-cell', activityId });
    for (const cell of state.bingoBoard.cells) delete cell.strokes;
    const raw = JSON.stringify(state); localStorage.setItem(STORAGE_KEY, raw);
    const loaded = loadState();
    expect(loaded.problem).toBeNull(); expect(coinBalance(loaded.state)).toBe(10);
    expect(loaded.state.bingoBoard.cells[0].strokes).toEqual(accessibleX());
    expect(loaded.state.bingoBoard.cells[3].strokes).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    expect(validateState(loaded.state)).toBe(true);
  });
  it('rejects malformed ink and completion/ink mismatches without resetting data', () => {
    const state = createInitialState();
    state.bingoBoard.cells[0].strokes = [[[0, 0], [101, 100]]];
    const raw = JSON.stringify(state); localStorage.setItem(STORAGE_KEY, raw);
    expect(loadState().problem).toBe('invalid'); expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    state.bingoBoard.cells[0].strokes = accessibleX();
    expect(validateState(state)).toBe(false);
  });
});
