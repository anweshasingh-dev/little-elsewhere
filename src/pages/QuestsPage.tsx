import { quests } from '../data/quests';
import { QuestCard } from '../features/quests/QuestCard';
import { useAppState } from '../app/AppStateProvider';
export function QuestsPage() {
  const { state } = useAppState();
  const completed = state.questProgress.filter((quest) => ['completed', 'claimed'].includes(quest.status)).length;
  return <div className="quests-page"><div className="page-title-row"><div className="quests-intro"><img src="/assets/home_icons/quest_icon.png" alt="" width="1448" height="1086" /><div><h1>Quests</h1><p>A little something to notice, make, or share.</p></div></div><span className="quest-total">{completed} of 8 explored</span></div><div className="adventure-list">{quests.map((quest) => <QuestCard key={quest.id} quest={quest} />)}</div><p className="gentle-endnote">Explore safely with an adult when appropriate. Each adventure earns coins once. Indoor options count too.</p></div>;
}


