import { useAppState } from '../app/AppStateProvider';
import { coinBalance } from '../app/state';
import { bingoActivities } from '../data/bingoActivities';
import { NatureIllustration } from './NatureIllustration';
import { Icon } from './Icon';

export function BackpackCollection() {
  const { state } = useAppState();
  const coins = coinBalance(state);
  const badges = [
    { title: 'First little step', art: 'tiny', earned: state.completionRecords.length > 0, description: 'Complete a quest or bingo line' },
    { title: 'Curious explorer', art: 'leaf', earned: coins >= 30, description: 'Earn 30 coins' },
    { title: 'Wonder collector', art: 'flower', earned: coins >= 75, description: 'Earn 75 coins' },
  ];
  return <section className="backpack-collection" aria-labelledby="backpack-title"><div className="backpack-welcome"><img src="/assets/global/bagpack.png" alt="Your adventure backpack"/><div><p className="home-eyebrow">MY COLLECTION</p><h2 id="backpack-title">In my backpack</h2></div></div>
    <div className="collection-keepsakes" aria-label="Your milestones">{badges.map(badge => <div className={`collection-keepsake ${badge.earned ? 'is-earned' : ''}`} key={badge.title}><NatureIllustration name={badge.art}/><div><h3>{badge.title}</h3><p>{badge.earned ? 'EARNED' : 'STILL TO EXPLORE'}</p><span className="sr-only">{badge.description}</span></div>{badge.earned && <Icon name="check"/>}</div>)}</div>
    <details className="collected-discoveries"><summary>My nature finds</summary><ul>{bingoActivities.map(activity => {
      const found = state.bingoFoundIds.includes(activity.id);
      return <li className={found ? 'is-found' : ''} key={activity.id}><NatureIllustration name={activity.id}/><span>{activity.label}</span><small>{found ? 'Discovered' : 'Not discovered yet'}</small></li>;
    })}</ul></details>
  </section>;
}
