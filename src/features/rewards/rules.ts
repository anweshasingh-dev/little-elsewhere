export const rewardRules = {
  bingoLine: 10,
  bingoFull: 20,
  quest: { gentle: 5, medium: 10, longer: 15 },
  maxCoins: 105,
} as const;
export type Effort = keyof typeof rewardRules.quest;
