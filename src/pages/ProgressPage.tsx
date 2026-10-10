import { CoinIcon } from '../components/CoinIcon';
import { useAppState } from '../app/AppStateProvider';
import { coinBalance } from '../app/state';
import { quests } from '../data/quests';
import { Icon } from '../components/Icon';
import { EmptyState } from '../components/EmptyState';
import { NatureIllustration } from '../components/NatureIllustration';
export function ProgressPage() {
  const { state } = useAppState();
  const coins = coinBalance(state);
  const completed = state.questProgress.filter((quest) => ['completed', 'claimed'].includes(quest.status)).length;
  const count = state.bingoBoard.cells.filter((cell) => cell.completed).length;
  const badges = [{ title: 'First little step', art: 'tiny', earned: state.completionRecords.length > 0, description: 'Complete a quest or bingo line' }, { title: 'Curious explorer', art: 'leaf', earned: coins >= 30, description: 'Earn 30 coins' }, { title: 'Wonder collector', art: 'flower', earned: coins >= 75, description: 'Earn 75 coins' }];
  return <div className="progress-page"><div className="page-title-row"><div><h1>Progress</h1><p>Your little collection of real-world wonders.</p></div></div><p className="progress-tally"><span><CoinIcon className="mini-coin" />{coins} coins earned</span><span>{state.bingoFoundIds.length} different discoveries</span><span>{completed} quests complete</span></p>
    <section className="keepsake-shelf" aria-label="Your milestones">{badges.map((badge) => <div className={`keepsake ${badge.earned ? 'keepsake-earned' : ''}`} key={badge.title}><div className="keepsake-art"><NatureIllustration name={badge.art} /></div><h2>{badge.title}</h2><p>{badge.description}</p><span className="pixel-label">{badge.earned ? 'EARNED' : 'STILL TO EXPLORE'}</span></div>)}</section>
    <a className="little-trail" href="#/bingo"><span className="trail-dots" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i className={index < count ? 'filled' : ''} key={index} />)}</span><span>Current board: {count} of 9</span><Icon name="arrow" /></a>
    <section className="discovery-notes"><h2>Discovery notes</h2>{state.completionRecords.length === 0 ? <EmptyState title="Your first discovery is waiting" description="Choose an adventure whenever you're ready." /> : <ul className="history-list">{[...state.completionRecords].reverse().map((record) => <li key={record.id}><Icon name={record.kind === 'quest' ? 'leaf' : 'bingo'} /><div><strong>{record.kind === 'quest' ? quests.find((quest) => quest.id === record.sourceId)?.title : record.kind === 'bingo-line' ? 'Your first bingo line' : 'Your first full bingo board'}</strong><span>{new Date(record.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div><Icon name="check" /></li>)}</ul>}</section><p className="gentle-endnote">Little acknowledgments, no extra coins or pressure. The best part happened away from the screen.</p></div>;
}

