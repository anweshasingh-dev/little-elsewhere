import { useState } from 'react';
import { useAppState } from '../app/AppStateProvider';
import { quests } from '../data/quests';
import { Icon } from './Icon';
import { NatureIllustration } from './NatureIllustration';
import type { CompletionRecord } from '../app/state';

export function journalDate(timestamp?: string) {
  if (!timestamp) return undefined;
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
export function AdventureJournal() {
  const { state } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const unique = new Map<string, CompletionRecord>();
  const records = [...state.completionRecords].sort((a, b) => (Date.parse(b.completedAt) || 0) - (Date.parse(a.completedAt) || 0));
  for (const record of records) {
    const key = `${record.kind}:${record.sourceId}`;
    if (!unique.has(key)) unique.set(key, record);
  }
  const entries = [...unique.values()];
  return <section className="adventure-journal" aria-labelledby="journal-title"><div className="section-heading"><h2 id="journal-title">Little discoveries</h2>{entries.length > 3 && <button className="journal-toggle" type="button" aria-expanded={expanded} aria-controls="journal-entries" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show recent' : 'See all'}</button>}</div>
    {entries.length === 0 ? <p className="journal-empty">Your first discovery is waiting</p> : <ul id="journal-entries" className="journal-entries">{(expanded ? entries : entries.slice(0, 3)).map((record) => {
      const quest = record.kind === 'quest' ? quests.find(item => item.id === record.sourceId) : undefined;
      const date = journalDate(record.completedAt);
      return <li key={`${record.kind}:${record.sourceId}`}>
        {quest ? <NatureIllustration name={quest.icon}/> : <img src="/assets/home_icons/bingo_icon.png" alt=""/>}
        <div><strong>{quest?.title ?? (record.kind === 'bingo-line' ? 'Your first bingo line' : record.kind === 'bingo-full' ? 'Your first full bingo board' : 'A little adventure')}</strong>{date && <time dateTime={record.completedAt}>{date}</time>}</div><Icon name="check"/>
      </li>;
    })}</ul>}
  </section>;
}
