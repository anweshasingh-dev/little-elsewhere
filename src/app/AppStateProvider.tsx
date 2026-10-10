import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { appReducer } from './reducer';
import type { Action } from './reducer';
import { coinBalance, createInitialState } from './state';
import type { AppState } from './state';
import { loadState, saveState, STORAGE_KEY } from '../persistence/storage';

type Problem = 'invalid' | 'unavailable' | 'conflict' | null;
type Session = { state: AppState; raw: string | null; problem: Problem };
type ContextValue = {
  state: AppState; problem: Problem; dispatch: (action: Action) => void;
  retry: () => void; recover: () => void; reload: () => void;
  notification: { id: number; message: string } | null; clearNotification: () => void;
};
const StateContext = createContext<ContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() => loadState());
  const current = useRef(session);
  const [notification, setNotification] = useState<ContextValue['notification']>(null);
  const notificationId = useRef(0);
  const clearNotification = useCallback(() => setNotification(null), []);
  function update(next: Session) { current.current = next; setSession(next); }
  function notify(message: string) { setNotification({ id: ++notificationId.current, message }); }
  function conflictDetected() {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== current.current.raw) {
        update({ ...current.current, problem: 'conflict' });
        return true;
      }
    } catch { /* Storage-disabled mode remains usable in memory. */ }
    return false;
  }
  function persist(state: AppState) {
    try { update({ state, raw: saveState(state), problem: null }); }
    catch { update({ ...current.current, state, problem: 'unavailable' }); }
  }
  function dispatch(action: Action) {
    if (current.current.problem === 'invalid' || current.current.problem === 'conflict' || conflictDetected()) return;
    const before = current.current.state;
    const next = appReducer(before, action);
    if (before === next) return;
    persist(next);
    const coins = coinBalance(next) - coinBalance(before);
    const lines = next.bingoBoard.id === before.bingoBoard.id ? next.bingoBoard.celebratedLines.length - before.bingoBoard.celebratedLines.length : 0;
    if (coins > 0) notify(`A little discovery! +${coins} coins earned.`);
    else if (lines > 0) notify(`${lines === 1 ? 'A new line' : `${lines} new lines`} of discoveries! Lovely exploring.`);
    else if (action.type === 'complete-quest') notify('Quest complete! Your coins are ready to claim.');
  }
  function retry() {
    if (current.current.problem !== 'unavailable' || conflictDetected()) return;
    persist(current.current.state);
  }
  function recover() {
    // Called only after explicit recovery confirmation. Invalid data is never overwritten automatically.
    if (current.current.problem !== 'invalid') return;
    persist(createInitialState());
  }
  function reload() { update(loadState()); setNotification(null); }
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if ((event.key === STORAGE_KEY || event.key === null) && event.newValue !== current.current.raw) {
        current.current = { ...current.current, problem: 'conflict' };
        setSession(current.current);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return <StateContext.Provider value={{ state: session.state, problem: session.problem, dispatch, retry, recover, reload, notification, clearNotification }}>{children}</StateContext.Provider>;
}
export function useAppState() {
  const context = useContext(StateContext);
  if (!context) throw new Error('AppStateProvider is required.');
  return context;
}
