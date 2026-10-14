import { CoinIcon } from './CoinIcon';
import { useEffect, useRef, useState } from 'react';
import { useAppState } from '../app/AppStateProvider';
import { coinBalance } from '../app/state';
export function CoinBalance() {
  const { state } = useAppState();
  const coins = coinBalance(state);
  const previous = useRef(coins);
  const [collecting, setCollecting] = useState(false);
  useEffect(() => {
    if (coins <= previous.current) { previous.current = coins; return; }
    previous.current = coins;
    setCollecting(true);
    const timer = window.setTimeout(() => setCollecting(false), 550);
    return () => window.clearTimeout(timer);
  }, [coins]);
  return <div className={`coin-balance ${collecting ? 'is-collecting' : ''}`} aria-label={`${coins} coins`}><CoinIcon className="coin-art" /><strong className="reward-number" data-testid="coin-balance">{coins}</strong><span className="sr-only">coins</span></div>;
}

