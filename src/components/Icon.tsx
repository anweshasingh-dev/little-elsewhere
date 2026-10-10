import { CoinIcon } from './CoinIcon';
import { ArrowUpRight, Bird, Check, CircleHelp, Cloud, Flower2, Grid2X2, House, Leaf, Pencil, Shapes, Sparkles, Sprout, Trophy, Undo2, Volume2, X } from 'lucide-react';
import type { CSSProperties } from 'react';
const icons = { home: House, bingo: Grid2X2, quests: Leaf, progress: Trophy, leaf: Leaf, cloud: Cloud, sun: Sparkles, bird: Bird, flower: Flower2, sound: Volume2, shape: Shapes, butterfly: Flower2, sprout: Sprout, drop: Sprout, pencil: Pencil, star: Sparkles, check: Check, arrow: ArrowUpRight, help: CircleHelp, undo: Undo2, close: X };
export function Icon({ name, className = '', style }: { name: string; className?: string; style?: CSSProperties }) {
  if (name === 'coin') return <CoinIcon className={'icon ' + className} style={style} />;
  const Component = icons[name as keyof typeof icons] ?? Sparkles;
  return <Component className={`icon ${className}`} style={style} size={22} strokeWidth={1.8} aria-hidden="true" />;
}


