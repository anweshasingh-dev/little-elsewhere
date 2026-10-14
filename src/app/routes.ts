import { useSyncExternalStore } from 'react';

export const routes = [
  { path: '#/', label: 'Home' },
  { path: '#/bingo', label: 'Bingo' },
  { path: '#/quests', label: 'Quests' },
] as const;

export type RoutePath = (typeof routes)[number]['path'] | '#/progress';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getSnapshot() {
  return window.location.hash || '#/';
}

export function useRoute(): RoutePath | null {
  const hash = useSyncExternalStore(subscribe, getSnapshot);
  return hash === '#/progress' ? '#/progress' : routes.find((route) => route.path === hash)?.path ?? null;
}
