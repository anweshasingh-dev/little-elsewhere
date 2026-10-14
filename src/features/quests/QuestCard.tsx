import { CoinIcon } from '../../components/CoinIcon';
import { useAppState } from '../../app/AppStateProvider';
import type { QuestDefinition } from '../../data/quests';
import { Icon } from '../../components/Icon';
import { NatureIllustration } from '../../components/NatureIllustration';
import { Button } from '../../components/Button';
const stages = [{ label: 'Choose', art: 'search' }, { label: 'Explore', art: 'paper_plane' }, { label: 'Collect', art: 'star' }];
export function QuestCard({ quest }: { quest: QuestDefinition }) {
  const { state, dispatch } = useAppState();
  const status = state.questProgress.find((item) => item.questId === quest.id)!.status;
  const currentStage = status === 'available' ? 0 : status === 'active' ? 1 : 2;
  return <article className={`quest-entry quest-${status}`} aria-label={quest.title}><NatureIllustration name={quest.icon} />
    <div className="quest-story"><div className="quest-title"><h2>{quest.title}</h2><span className="quest-status sr-only">{status === 'active' ? 'In progress' : status === 'completed' || status === 'claimed' ? 'Completed' : 'Ready'}</span></div><ol className="quest-trail" aria-label="Quest progress">{stages.map((stage, index) => {
      const done = index < currentStage || status === 'claimed';
      return <li key={stage.label} className={done ? 'stage-done' : index === currentStage ? 'stage-current' : 'stage-upcoming'} aria-current={!done && index === currentStage ? 'step' : undefined}><NatureIllustration name={stage.art} /><span>{stage.label}</span>{done && <Icon name="check" />}<span className="sr-only">{done ? ' complete' : index === currentStage ? ' current step' : ' upcoming'}</span></li>;
    })}</ol><details><summary>How to explore</summary><p>{quest.description}</p><strong>Another way to play</strong><p>{quest.alternative}</p><p className="fine-print">Suggested time: {quest.duration}. Go at your own pace.</p></details>{status === 'active' && <p className="completion-instruction">When you return: {quest.completionInstruction}</p>}</div>
    <div className="quest-actions"><span className="quest-reward"><CoinIcon className="mini-coin" /><span className="reward-number">{quest.coinReward}</span><span className="sr-only">coins</span></span>
      {status === 'available' && <Button onClick={() => dispatch({ type: 'start-quest', questId: quest.id })}>Start quest <Icon name="arrow" /></Button>}
      {status === 'active' && <><Button onClick={() => dispatch({ type: 'complete-quest', questId: quest.id })}>I did it!</Button><button className="small-action" onClick={() => dispatch({ type: 'abandon-quest', questId: quest.id })}>Choose another time</button></>}
      {status === 'completed' && <Button onClick={() => dispatch({ type: 'claim-quest', questId: quest.id })}>Claim {quest.coinReward} coins</Button>}
      {status === 'claimed' && <span className="claimed-label"><Icon name="check" />Coins collected</span>}
    </div>
  </article>;
}

