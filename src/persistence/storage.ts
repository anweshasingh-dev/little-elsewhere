import { upgradeDrawing } from './migration';
import { createInitialState } from '../app/state';
import type { AppState } from '../app/state';
import { validateState } from './validation';
export const STORAGE_KEY = 'little-elsewhere:state:v1';
export type LoadResult = { state: AppState; raw: string | null; problem: 'invalid' | 'unavailable' | null };
export function loadState(): LoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { state: createInitialState(), raw, problem: null };
    const parsed: unknown = JSON.parse(raw);
    return validateState(parsed) ? { state: upgradeDrawing(parsed), raw, problem: null } : { state: createInitialState(), raw, problem: 'invalid' };
  } catch (error) {
    return { state: createInitialState(), raw: null, problem: error instanceof SyntaxError ? 'invalid' : 'unavailable' };
  }
}
export function saveState(state: AppState): string {
  const raw = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, raw);
  return raw;
}
