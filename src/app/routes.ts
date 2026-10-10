import { useSyncExternalStore } from 'react';

export const routes = [
  { path: '#/', label: 'Home' },
  { path: '#/bingo', label: 'Bingo' },
  { path: '#/quests', label: 'Quests' },
  { path: '#/progress', label: 'Progress' },
] as const;

export type RoutePath = (typeof routes)[number]['path'];

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getSnapshot() {
  return window.location.hash || '#/';
}

export function useRoute(): RoutePath | null {
  const hash = useSyncExternalStore(subscribe, getSnapshot);
  return routes.find((route) => route.path === hash)?.path ?? null;
}
