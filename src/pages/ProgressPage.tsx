import { AdventureJournal } from '../components/AdventureJournal';
import { BackpackCollection } from '../components/BackpackCollection';
/** Compatibility for bookmarks; progress now lives directly on Home. */
export function ProgressPage() {
  return <div className="progress-page"><div className="page-title-row"><div><h1>Progress</h1><a className="button button-secondary" href="#/">Back to my Home</a></div></div><div className="home-scrapbook"><AdventureJournal/><BackpackCollection/></div></div>;
}
