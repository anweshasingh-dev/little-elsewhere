import { useEffect, useRef } from 'react';
import { SiteFooter } from '../components/SiteFooter';
import { Navigation } from '../components/Navigation';
import { CoinBalance } from '../components/CoinBalance';
import { FirstTimeHelp } from '../components/FirstTimeHelp';
import { RewardFeedback } from '../components/RewardFeedback';
import { StorageStatus } from '../components/StorageStatus';
import { Icon } from '../components/Icon';
import { HomePage } from '../pages/HomePage';
import { BingoPage } from '../pages/BingoPage';
import { QuestsPage } from '../pages/QuestsPage';
import { ProgressPage } from '../pages/ProgressPage';
import { useRoute } from './routes';
import { AppStateProvider, useAppState } from './AppStateProvider';

function AppShell() {
  const route = useRoute();
  const { problem } = useAppState();
  const mainRef = useRef<HTMLElement>(null);
  const previousRoute = useRef(route);
  useEffect(() => {
    const title = route === '#/' ? 'Home' : route === '#/bingo' ? 'Bingo' : route === '#/quests' ? 'Quests' : route === '#/progress' ? 'Progress' : 'Page not found';
    document.title = `${title} | Little Elsewhere`;
    if (previousRoute.current !== route) mainRef.current?.focus();
    previousRoute.current = route;
  }, [route]);
  return <div className="site-frame"><div className={`app-shell ${route === '#/' ? 'home-shell' : ''}`}><a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); mainRef.current?.focus(); }}>Skip to content</a>
    <header className="site-header"><div className="brand-row"><a className="brand" href="#/" aria-label="Little Elsewhere home"><span className="brand-symbol"><Icon name="sprout" /></span><span>little elsewhere</span></a><div className="nav-row"><Navigation currentRoute={route} /></div><div className="header-tools">{problem !== 'invalid' && <CoinBalance />}</div></div></header>
    <main id="main-content" ref={mainRef} tabIndex={-1}><StorageStatus /><RewardFeedback /><FirstTimeHelp />{problem !== 'invalid' && <fieldset className="view-content" disabled={problem === 'conflict'} aria-label="Adventure content">
      {route === '#/' && <HomePage />}{route === '#/bingo' && <BingoPage />}{route === '#/quests' && <QuestsPage />}{route === '#/progress' && <ProgressPage />}
      {route === null && <section className="page-panel"><h1>Let's find our way home</h1><p>We couldn't find that page.</p><a className="text-link" href="#/">Return home</a></section>}
    </fieldset>}</main></div><SiteFooter /></div>;
}
export function App() { return <AppStateProvider><AppShell /></AppStateProvider>; }

