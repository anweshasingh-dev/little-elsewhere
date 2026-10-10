import { Icon } from './Icon';
export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><Icon name="sprout" /><h3>{title}</h3><p>{description}</p></div>;
}
