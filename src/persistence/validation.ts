import { isAvatarId } from '../data/avatars';
import { hasValidX, validStrokes } from '../features/bingo/drawing';
import type { AppState } from '../app/state';
import { bingoActivities } from '../data/bingoActivities';
import { quests } from '../data/quests';
import { rewardRules } from '../features/rewards/rules';
import { completedLines } from '../features/bingo/logic';
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const timestamp = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value));
const unique = (values: unknown[]) => new Set(values).size === values.length;

export function validateState(value: unknown): value is AppState {
  if (!object(value) || value.schemaVersion !== 1 || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0 || typeof value.onboardingSeen !== 'boolean') return false;
  if (!object(value.bingoBoard) || !Array.isArray(value.bingoBoard.cells) || !Array.isArray(value.bingoBoard.celebratedLines)) return false;
  if (!Array.isArray(value.questProgress) || !Array.isArray(value.completionRecords) || !Array.isArray(value.coinLedger) || !Array.isArray(value.bingoFoundIds)) return false;
  if (value.homeProfile !== undefined) {
    const profile = value.homeProfile;
    if (!object(profile) || typeof profile.name !== 'string' || profile.name.length > 40) return false;
    if (profile.avatarId !== undefined && !isAvatarId(profile.avatarId)) return false;
    if (profile.age !== undefined && (!Number.isInteger(profile.age) || Number(profile.age) < 1 || Number(profile.age) > 18)) return false;
    if (profile.mood !== undefined && !['happy', 'excited', 'calm', 'sad', 'tired'].includes(String(profile.mood))) return false;
  }
  const state = value as unknown as AppState;
  const board = state.bingoBoard;
  const ids: string[] = bingoActivities.map((activity) => activity.id);
  if (typeof board.id !== 'string' || board.id.length === 0 || !timestamp(board.createdAt) || board.cells.length !== 9) return false;
  if (!board.cells.every((cell) => object(cell) && typeof cell.activityId === 'string' && ids.includes(cell.activityId) && typeof cell.completed === 'boolean')) return false;
  if (!unique(board.cells.map((cell) => cell.activityId))) return false;
  if (board.cells.some((cell) => cell.strokes !== undefined && (!validStrokes(cell.strokes) || cell.completed !== hasValidX(cell.strokes)))) return false;
  if (!unique(board.celebratedLines) || !board.celebratedLines.every((line) => Number.isInteger(line) && line >= 0 && line < 8)) return false;
  if (!unique(state.bingoFoundIds) || !state.bingoFoundIds.every((id) => typeof id === 'string' && ids.includes(id))) return false;
  if (board.cells.some((cell) => cell.completed && !state.bingoFoundIds.includes(cell.activityId))) return false;
  if (completedLines(board.cells).some((line) => !board.celebratedLines.includes(line))) return false;
  if (state.questProgress.length !== quests.length || !state.questProgress.every((progress) => object(progress) && quests.some((quest) => quest.id === progress.questId))) return false;
  if (!unique(state.questProgress.map((progress) => progress.questId))) return false;
  for (const progress of state.questProgress) {
    if (!['available', 'active', 'completed', 'claimed'].includes(progress.status)) return false;
    if (progress.status !== 'available' && !timestamp(progress.startedAt)) return false;
    if (['completed', 'claimed'].includes(progress.status) && !timestamp(progress.completedAt)) return false;
    if (progress.status === 'claimed' && !timestamp(progress.claimedAt)) return false;
    if (progress.status === 'available' && (progress.startedAt !== undefined || progress.completedAt !== undefined || progress.claimedAt !== undefined)) return false;
    if (progress.status === 'active' && (progress.completedAt !== undefined || progress.claimedAt !== undefined)) return false;
    if (progress.status === 'completed' && progress.claimedAt !== undefined) return false;
  }
  if (!state.completionRecords.every((record) => object(record) && typeof record.id === 'string' && typeof record.sourceId === 'string' && timestamp(record.completedAt))) return false;
  if (!unique(state.completionRecords.map((record) => record.id))) return false;
  for (const record of state.completionRecords) {
    if (record.kind === 'quest') {
      const progress = state.questProgress.find((item) => item.questId === record.sourceId);
      if (record.id !== `quest:${record.sourceId}` || !progress || !['completed', 'claimed'].includes(progress.status) || record.completedAt !== progress.completedAt) return false;
    } else if (record.kind === 'bingo-line' || record.kind === 'bingo-full') {
      if (record.id !== (record.kind === 'bingo-line' ? 'bingo:first-line' : 'bingo:first-full') || !record.sourceId) return false;
    } else return false;
  }
  if (!state.coinLedger.every((entry) => object(entry) && typeof entry.awardKey === 'string' && Number.isSafeInteger(entry.amount) && entry.amount > 0 && timestamp(entry.awardedAt))) return false;
  if (!unique(state.coinLedger.map((entry) => entry.awardKey))) return false;
  for (const entry of state.coinLedger) {
    if (entry.reason === 'quest') {
      const quest = quests.find((item) => item.id === entry.sourceId);
      const progress = state.questProgress.find((item) => item.questId === entry.sourceId);
      if (!quest || progress?.status !== 'claimed' || entry.awardKey !== `quest:${quest.id}:first-completion` || entry.amount !== quest.coinReward || entry.awardedAt !== progress.claimedAt) return false;
    } else if (entry.reason === 'bingo-line' || entry.reason === 'bingo-full') {
      const key = entry.reason === 'bingo-line' ? 'bingo:first-line' : 'bingo:first-full';
      if (entry.awardKey !== key || entry.amount !== (entry.reason === 'bingo-line' ? rewardRules.bingoLine : rewardRules.bingoFull)) return false;
    } else return false;
    const record = state.completionRecords.find((item) => item.id === (entry.reason === 'quest' ? `quest:${entry.sourceId}` : entry.awardKey));
    if (!record || record.kind !== entry.reason || record.sourceId !== entry.sourceId) return false;
  }
  for (const progress of state.questProgress) {
    const record = state.completionRecords.find((item) => item.id === `quest:${progress.questId}`);
    const entry = state.coinLedger.find((item) => item.awardKey === `quest:${progress.questId}:first-completion`);
    if (['completed', 'claimed'].includes(progress.status) !== Boolean(record) || (progress.status === 'claimed') !== Boolean(entry)) return false;
  }
  for (const record of state.completionRecords.filter((item) => item.kind !== 'quest')) {
    if (!state.coinLedger.some((entry) => entry.awardKey === record.id)) return false;
  }
  const hasLine = state.coinLedger.some((entry) => entry.awardKey === 'bingo:first-line');
  const hasFull = state.coinLedger.some((entry) => entry.awardKey === 'bingo:first-full');
  if ((board.celebratedLines.length > 0 && !hasLine) || (hasFull && !hasLine) || (board.cells.every((cell) => cell.completed) && !hasFull)) return false;
  return state.coinLedger.reduce((sum, entry) => sum + entry.amount, 0) <= rewardRules.maxCoins;
}


