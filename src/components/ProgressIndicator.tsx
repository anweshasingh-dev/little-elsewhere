export function ProgressIndicator({ label, value, max }: { label: string; value: number; max: number }) {
  return <div className="progress-indicator"><div><span>{label}</span><strong className="pixel-detail">{value}/{max}</strong></div><progress aria-label={label} value={value} max={max} /></div>;
}
