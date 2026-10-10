import type { AvatarId } from '../data/avatars';
import type { Stroke } from '../features/bingo/drawing';
import { bingoActivities } from '../data/bingoActivities';
import { quests } from '../data/quests';
export type QuestStatus = 'available' | 'active' | 'completed' | 'claimed';
export interface BingoCell { activityId: string; completed: boolean; strokes?: Stroke[] }
export interface BingoBoard { id: string; createdAt: string; cells: BingoCell[]; celebratedLines: number[] }
export interface QuestProgress { questId: string; status: QuestStatus; startedAt?: string; completedAt?: string; claimedAt?: string }
export interface CompletionRecord { id: string; kind: 'quest' | 'bingo-line' | 'bingo-full'; sourceId: string; completedAt: string }
export interface CoinEntry { awardKey: string; amount: number; reason: CompletionRecord['kind']; sourceId: string; awardedAt: string }
export type Mood = 'happy' | 'excited' | 'calm' | 'sad' | 'tired';
export interface HomeProfile { name: string; age?: number; mood?: Mood; avatarId?: AvatarId }
export interface AppState {
  homeProfile?: HomeProfile;
  schemaVersion: 1; revision: number; onboardingSeen: boolean;
  bingoBoard: BingoBoard; bingoFoundIds: string[];
  questProgress: QuestProgress[]; completionRecords: CompletionRecord[]; coinLedger: CoinEntry[];
}
export function createBoard(): BingoBoard {
  return { id: crypto.randomUUID(), createdAt: new Date().toISOString(),
    cells: bingoActivities.map((activity) => ({ activityId: activity.id, completed: false, strokes: [] })), celebratedLines: [] };
}
export function createInitialState(): AppState {
  return { schemaVersion: 1, revision: 0, onboardingSeen: false, bingoBoard: createBoard(), bingoFoundIds: [],
    questProgress: quests.map((quest) => ({ questId: quest.id, status: 'available' })), completionRecords: [], coinLedger: [] };
}
export const coinBalance = (state: AppState) => state.coinLedger.reduce((sum, entry) => sum + entry.amount, 0);


