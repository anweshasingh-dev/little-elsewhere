import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { createInitialState } from '../app/state';
import { STORAGE_KEY } from '../persistence/storage';

// jsdom does not implement native modal focus behavior; real-browser checks cover it.
HTMLDialogElement.prototype.showModal = function () { this.open = true; };
HTMLDialogElement.prototype.close = function () { this.open = false; };
beforeEach(() => {
  localStorage.clear();
  const state = createInitialState();
  state.onboardingSeen = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});