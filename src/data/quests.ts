import { rewardRules } from '../features/rewards/rules';
import type { Effort } from '../features/rewards/rules';

export interface QuestDefinition {
  id: string; title: string; description: string;
  category: 'nature' | 'observation' | 'movement' | 'creative';
  effort: Effort; duration: string; coinReward: number; icon: string;
  completionInstruction: string; alternative: string;
}
const definitions: Omit<QuestDefinition, 'coinReward'>[] = [
  { id: 'leaf-trio', title: 'A little leaf collection', description: 'Notice three leaves with different shapes. Leave growing leaves on their plants.', category: 'nature', effort: 'medium', duration: '5–10 min', icon: 'leaf', completionInstruction: 'I noticed three different leaf shapes.', alternative: 'Look at a houseplant or draw three imaginary leaf shapes.' },
  { id: 'cloud-story', title: 'Cloud daydreams', description: 'Look through a window or up at the sky. What does one cloud remind you of?', category: 'observation', effort: 'gentle', duration: '2–5 min', icon: 'cloud', completionInstruction: 'I imagined a shape in a cloud.', alternative: 'Find a shape in a cushion, ceiling pattern, or drawing.' },
  { id: 'nature-colors', title: 'Nature’s tiny rainbow', description: 'Find three colors in nature. Look closely without picking anything.', category: 'nature', effort: 'medium', duration: '5–10 min', icon: 'flower', completionInstruction: 'I noticed three different colors.', alternative: 'Find three colors in houseplants, fruit on the table, or a nature picture.' },
  { id: 'sound-map', title: 'Quiet little listeners', description: 'Pause somewhere safe and notice three sounds. No need to close your eyes.', category: 'observation', effort: 'medium', duration: '5 min', icon: 'sound', completionInstruction: 'I noticed three different sounds.', alternative: 'Listen from a comfy seat indoors, or notice three things you can feel or see.' },
  { id: 'plant-helper', title: 'A sip for a plant', description: 'Ask an adult whether a plant needs water. Help give it the right amount.', category: 'nature', effort: 'gentle', duration: '2–5 min', icon: 'drop', completionInstruction: 'I helped care for a plant with permission.', alternative: 'Ask about plant care, or draw a plant you would like to look after.' },
  { id: 'discovery-drawing', title: 'Draw your discovery', description: 'On paper, draw a leaf, cloud, bird, or other little wonder you noticed.', category: 'creative', effort: 'longer', duration: '10–15 min', icon: 'pencil', completionInstruction: 'I made a drawing of a discovery.', alternative: 'Draw something from a window, describe it aloud, or make a tactile shape.' },
  { id: 'pattern-hunt', title: 'A pattern hiding nearby', description: 'Notice an interesting pattern on a leaf, shell, or stone. Looking is enough.', category: 'observation', effort: 'gentle', duration: '2–5 min', icon: 'shape', completionInstruction: 'I noticed an interesting pattern.', alternative: 'Look at wood grain, a fabric pattern, or a nature picture indoors.' },
  { id: 'family-play', title: 'Play a little together', description: 'Enjoy an offline game with family. Try cards, a guessing game, or pretend play.', category: 'movement', effort: 'longer', duration: 'About 10 min', icon: 'star', completionInstruction: 'I enjoyed an offline game with family.', alternative: 'Choose a seated game, tell a story together, or do a puzzle side by side.' },
];
export const quests: QuestDefinition[] = definitions.map((quest) => ({ ...quest, coinReward: rewardRules.quest[quest.effort] }));
export const questById = (id: string) => quests.find((quest) => quest.id === id);
