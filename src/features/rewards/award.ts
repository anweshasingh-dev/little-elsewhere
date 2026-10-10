import type { AppState, CompletionRecord } from '../../app/state';
import { completedLines } from '../bingo/logic';
import { questById } from '../../data/quests';
import { rewardRules } from './rules';

export function award(state: AppState, kind: CompletionRecord['kind'], sourceId: string, now: string): AppState {
  let key: string;
  let amount: number;
  if (kind === 'quest') {
    const quest = questById(sourceId);
    const progress = state.questProgress.find((item) => item.questId === sourceId);
    if (!quest || progress?.status !== 'completed' || !state.completionRecords.some((item) => item.id === `quest:${sourceId}`)) return state;
    key = `quest:${sourceId}:first-completion`;
    amount = quest.coinReward;
  } else {
    if (sourceId !== state.bingoBoard.id) return state;
    if (kind === 'bingo-line' && completedLines(state.bingoBoard.cells).length === 0) return state;
    if (kind === 'bingo-full' && !state.bingoBoard.cells.every((cell) => cell.completed)) return state;
    key = kind === 'bingo-line' ? 'bingo:first-line' : 'bingo:first-full';
    amount = kind === 'bingo-line' ? rewardRules.bingoLine : rewardRules.bingoFull;
  }
  if (state.coinLedger.some((entry) => entry.awardKey === key)) return state;
  const completionRecords = kind === 'quest' ? state.completionRecords : [...state.completionRecords, { id: key, kind, sourceId, completedAt: now }];
  return { ...state, completionRecords,
    questProgress: kind === 'quest' ? state.questProgress.map((item) => item.questId === sourceId ? { ...item, status: 'claimed', claimedAt: now } : item) : state.questProgress,
    coinLedger: [...state.coinLedger, { awardKey: key, amount, reason: kind, sourceId, awardedAt: now }] };
}
