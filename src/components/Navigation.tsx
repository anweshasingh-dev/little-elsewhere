import { routes } from '../app/routes';
import type { RoutePath } from '../app/routes';
import { Icon } from './Icon';
export function Navigation({ currentRoute }: { currentRoute: RoutePath | null }) {
  return <nav aria-label="Main navigation"><ul className="navigation">{routes.map((route) => <li key={route.path}><a href={route.path} aria-current={currentRoute === route.path ? 'page' : undefined}><Icon name={route.label.toLowerCase()} /><span>{route.label}</span></a></li>)}</ul></nav>;
}
