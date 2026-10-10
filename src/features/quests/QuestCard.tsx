import { CoinIcon } from '../../components/CoinIcon';
import { useAppState } from '../../app/AppStateProvider';
import type { QuestDefinition } from '../../data/quests';
import { Icon } from '../../components/Icon';
import { NatureIllustration } from '../../components/NatureIllustration';
import { Button } from '../../components/Button';
const illustrations: Record<string, string> = { leaf: 'leaf', cloud: 'cloud', flower: 'flower', sound: 'sound', drop: 'leaf', pencil: 'shape', star: 'moving' };
export function QuestCard({ quest }: { quest: QuestDefinition }) {
  const { state, dispatch } = useAppState();
  const status = state.questProgress.find((item) => item.questId === quest.id)!.status;
  return <article className={`quest-entry quest-${status}`} aria-label={quest.title}><NatureIllustration name={illustrations[quest.icon] ?? 'leaf'} />
    <div className="quest-story"><div className="quest-title"><h2>{quest.title}</h2><span className="quest-status">{status === 'active' ? 'In progress' : status === 'completed' || status === 'claimed' ? 'Completed' : 'Ready'}</span></div><p>{quest.description}</p><details><summary>Another way to play</summary><p>{quest.alternative}</p><p className="fine-print">Suggested time: {quest.duration}. Go at your own pace.</p></details>{status === 'active' && <p className="completion-instruction">When you return: {quest.completionInstruction}</p>}</div>
    <div className="quest-actions"><span className="quest-reward"><CoinIcon className="mini-coin" /><span className="pixel-detail">{quest.coinReward}</span><span className="sr-only">coins</span></span>
      {status === 'available' && <Button onClick={() => dispatch({ type: 'start-quest', questId: quest.id })}>Start quest <Icon name="arrow" /></Button>}
      {status === 'active' && <><Button onClick={() => dispatch({ type: 'complete-quest', questId: quest.id })}>I did it!</Button><button className="small-action" onClick={() => dispatch({ type: 'abandon-quest', questId: quest.id })}>Choose another time</button></>}
      {status === 'completed' && <Button onClick={() => dispatch({ type: 'claim-quest', questId: quest.id })}>Claim {quest.coinReward} coins</Button>}
      {status === 'claimed' && <span className="claimed-label"><Icon name="check" />Coins collected</span>}
    </div>
  </article>;
}

