import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Icon } from '../../components/Icon';
import { NatureIllustration } from '../../components/NatureIllustration';
import { bingoActivities } from '../../data/bingoActivities';
import type { BingoCell as Cell } from '../../app/state';
import { MAX_POINTS, MAX_STROKES, normalizePoint } from './drawing';
import type { Stroke } from './drawing';

export function BingoCell({ cell, onToggle, onDraw, onClear, disabled = false }: {
  cell: Cell; onToggle: () => void; onDraw: (strokes: Stroke[]) => void; onClear: () => void; disabled?: boolean;
}) {
  const activityIndex = bingoActivities.findIndex((item) => item.id === cell.activityId);
  const activity = bingoActivities[activityIndex]!;
  // Catalog order is stable across board rearrangement, reload, and re-completion.
  const markColor = ['#B9CC89', '#B6D6D5', '#EED059', '#AFC170', '#70C0B8'][activityIndex % 5];
  const strokes = cell.strokes ?? [];
  const active = useRef<{ id: number; points: Stroke } | null>(null);
  const suppressClick = useRef(false);
  const [draft, setDraft] = useState<Stroke>([]);
  function point(event: PointerEvent<SVGSVGElement>) { return normalizePoint(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect()); }
  function cancel(event: PointerEvent<SVGSVGElement>) {
    if (active.current?.id !== event.pointerId) return;
    suppressClick.current = true;
    active.current = null; setDraft([]);
  }
  function append(event: PointerEvent<SVGSVGElement>) {
    if (active.current?.id !== event.pointerId) return;
    const next = point(event);
    const points = active.current.points;
    const last = points[points.length - 1];
    if (Math.hypot(last[0] - next[0], last[1] - next[1]) < .5) return;
    if (points.length >= MAX_POINTS) active.current.points = points.filter((_, index) => index % 2 === 0);
    active.current.points.push(next); setDraft([...active.current.points]);
  }
  function start(event: PointerEvent<SVGSVGElement>) {
    suppressClick.current = false;
    if (disabled || cell.completed || active.current || event.isPrimary === false || event.button !== 0 || strokes.length >= MAX_STROKES) return;
    event.preventDefault();
    suppressClick.current = false;
    active.current = { id: event.pointerId, points: [point(event)] };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDraft([...active.current.points]);
  }
  function finish(event: PointerEvent<SVGSVGElement>) {
    if (active.current?.id !== event.pointerId) return;
    append(event);
    const points = active.current.points;
    active.current = null; setDraft([]);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const length = points.slice(1).reduce((sum, p, index) => sum + Math.hypot(p[0] - points[index][0], p[1] - points[index][1]), 0);
    suppressClick.current = length >= 3;
    if (!disabled && points.length >= 2 && length >= 3) onDraw([...strokes, points]);
  }
  return <div className={`discovery-tile ${cell.completed ? 'hand-marked' : ''}`} role="group" aria-label={activity.label} onClick={(event) => {
    if ((event.target as Element).closest('button, .drawing-surface')) return;
    if (!disabled) onToggle();
  }}>
    <div className="tile-picture"><NatureIllustration name={activity.id} /><svg className="drawing-surface" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Draw an X for ${activity.label}`} onClick={(event) => {
      event.stopPropagation();
      if (suppressClick.current) { suppressClick.current = false; return; }
      if (!disabled) onToggle();
    }} onPointerDown={start} onPointerMove={append} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={(event) => {
      // A delayed loss from the previous stroke must not cancel a newly captured stroke.
      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) cancel(event);
    }}>
      {[...strokes, ...(draft.length ? [draft] : [])].map((stroke, index) => <polyline key={index} points={stroke.map((p) => p.join(',')).join(' ')} className="ink-stroke" style={{ stroke: markColor }} />)}
    </svg></div>
    <span className="tile-label">{activity.label}</span>
    <div className="cell-controls"><button className={`bingo-cell ${cell.completed ? 'undo-completion' : ''}`} title={cell.completed ? 'Undo completion' : 'Mark complete'} disabled={disabled} aria-pressed={cell.completed} aria-label={`${activity.label}: ${cell.completed ? 'completed, Undo completion' : 'mark complete'}. ${activity.instruction}`} onClick={onToggle}><Icon name={cell.completed ? 'undo' : 'check'} />{!cell.completed && <span>Mark</span>}</button>
      {!cell.completed && strokes.length > 0 && <button className="clear-ink" disabled={disabled} onClick={onClear} title="Clear drawing" aria-label={`Clear drawing for ${activity.label}`}><Icon name="undo" /></button>}
    </div>
  </div>;
}
