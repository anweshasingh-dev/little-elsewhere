import type { CSSProperties } from 'react';
export function CoinIcon({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <img className={`coin-image ${className}`} style={style} src="/assets/global/coin.png" alt="" aria-hidden="true" />;
}
