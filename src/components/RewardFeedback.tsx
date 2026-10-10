import { useEffect } from 'react';
import { useAppState } from '../app/AppStateProvider';
import { Icon } from './Icon';
export function RewardFeedback() {
  const { notification, clearNotification } = useAppState();
  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(clearNotification, 6500);
    return () => window.clearTimeout(timer);
  }, [notification, clearNotification]);
  return <div className="notification-region" role="status" aria-live="polite" aria-atomic="true">{notification && <div className="reward-toast" key={notification.id}><Icon name="star" /><span>{notification.message}</span><button aria-label="Dismiss notification" onClick={clearNotification}>×</button></div>}</div>;
}
