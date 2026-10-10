import { isAvatarId } from '../data/avatars';
import type { AvatarId } from '../data/avatars';
import { accessibleX, hasValidX, validStrokes } from '../features/bingo/drawing';
import type { Stroke } from '../features/bingo/drawing';
import { createBoard } from './state';
import type { AppState, Mood } from './state';
import { completedLines } from '../features/bingo/logic';
import { award } from '../features/rewards/award';
export type Action =
  | { type: 'toggle-cell'; activityId: string }
  | { type: 'draw-cell'; activityId: string; strokes: Stroke[] }
  | { type: 'clear-cell'; activityId: string }
  | { type: 'new-board' }
  | { type: 'start-quest' | 'abandon-quest' | 'complete-quest' | 'claim-quest'; questId: string }
  | { type: 'set-avatar'; avatarId: AvatarId }
  | { type: 'set-mood'; mood: Mood }
  | { type: 'set-home-profile'; name: string; age?: number }
  | { type: 'seen-help' };

export function appReducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString();
  let next = state;
  if (action.type === 'set-avatar') {
    if (!isAvatarId(action.avatarId) || state.homeProfile?.avatarId === action.avatarId) return state;
    next = { ...state, homeProfile: { name: '', ...state.homeProfile, avatarId: action.avatarId } };
  } else if (action.type === 'set-mood') {
    if (!['happy', 'excited', 'calm', 'sad', 'tired'].includes(action.mood) || state.homeProfile?.mood === action.mood) return state;
    next = { ...state, homeProfile: { name: '', ...state.homeProfile, mood: action.mood } };
  } else if (action.type === 'set-home-profile') {
    if (action.name.length > 40 || (action.age !== undefined && (!Number.isInteger(action.age) || action.age < 1 || action.age > 18))) return state;
    next = { ...state, homeProfile: { ...state.homeProfile, name: action.name, age: action.age } };
  } else if (action.type === 'seen-help') {
    if (!state.onboardingSeen) next = { ...state, onboardingSeen: true };
  } else if (action.type === 'new-board') {
    const board = createBoard();
    // Rotate the fixed, reviewed prompts for a fresh layout without new reward eligibility.
    const offset = (state.revision % 8) + 1;
    board.cells = [...board.cells.slice(offset), ...board.cells.slice(0, offset)];
    next = { ...state, bingoBoard: board };
  } else if (action.type === 'toggle-cell' || action.type === 'draw-cell' || action.type === 'clear-cell') {
    if (!state.bingoBoard.cells.some((cell) => cell.activityId === action.activityId)) return state;
    const target = state.bingoBoard.cells.find((cell) => cell.activityId === action.activityId)!;
    if (action.type === 'draw-cell' && (target.completed || !validStrokes(action.strokes))) return state;
    const strokes = action.type === 'draw-cell' ? action.strokes : action.type === 'clear-cell' || target.completed ? [] : accessibleX();
    if (action.type === 'clear-cell' && !target.completed && (target.strokes?.length ?? 0) === 0) return state;
    const cells = state.bingoBoard.cells.map((cell) => cell === target ? { ...cell, strokes, completed: hasValidX(strokes) } : cell);
    const lines = completedLines(cells);
    next = { ...state, bingoBoard: { ...state.bingoBoard, cells,
      celebratedLines: [...new Set([...state.bingoBoard.celebratedLines, ...lines])] },
      bingoFoundIds: [...new Set([...state.bingoFoundIds, ...cells.filter((cell) => cell.completed).map((cell) => cell.activityId)])] };
    next = award(next, 'bingo-line', next.bingoBoard.id, now);
    next = award(next, 'bingo-full', next.bingoBoard.id, now);
  } else {
    const quest = state.questProgress.find((item) => item.questId === action.questId);
    if (!quest) return state;
    if (action.type === 'claim-quest') next = award(state, 'quest', action.questId, now);
    if (action.type === 'start-quest' && quest.status === 'available') next = { ...state,
      questProgress: state.questProgress.map((item) => item === quest ? { ...item, status: 'active', startedAt: now } : item) };
    if (action.type === 'abandon-quest' && quest.status === 'active') next = { ...state,
      questProgress: state.questProgress.map((item) => item === quest ? { questId: item.questId, status: 'available' } : item) };
    if (action.type === 'complete-quest' && quest.status === 'active') next = { ...state,
      questProgress: state.questProgress.map((item) => item === quest ? { ...item, status: 'completed', completedAt: now } : item),
      completionRecords: [...state.completionRecords, { id: `quest:${quest.questId}`, kind: 'quest', sourceId: quest.questId, completedAt: now }] };
  }
  return next === state ? state : { ...next, revision: state.revision + 1 };
}


