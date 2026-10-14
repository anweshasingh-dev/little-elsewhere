import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../app/App';

async function navigate(hash: string) {
  await act(async () => { window.location.hash = hash; });
  await waitFor(() => expect(window.location.hash).toBe(hash));
}

describe('application navigation', () => {
  it('opens Home without a hash and exposes the three essential destinations', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Little explorer');
    const links = within(screen.getByRole('navigation')).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Home', 'Bingo', 'Quests']);
    expect(links[0].getAttribute('aria-current')).toBe('page');
  });

  it('follows navigation links, updates active state and title, and moves focus', async () => {
    render(<App />);
    for (const [label, heading] of [['Bingo', 'Nature Bingo'], ['Quests', 'Quests'], ['Home', 'Little explorer']]) {
      fireEvent.click(within(screen.getByRole('navigation')).getByRole('link', { name: label }));
      await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(heading));
      expect(within(screen.getByRole('navigation')).getByRole('link', { name: label }).getAttribute('aria-current')).toBe('page');
      expect(document.title).toBe(`${label} | Little Elsewhere`);
      expect(document.activeElement).toBe(screen.getByRole('main'));
    }
  });

  it.each([['#/bingo', 'Nature Bingo'], ['#/quests', 'Quests'], ['#/progress', 'Progress']])('opens a direct link at %s', (hash, heading) => {
    window.history.replaceState(null, '', hash);
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(heading);
  });

  it('responds to history-style hash changes', async () => {
    render(<App />);
    await navigate('#/quests');
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Quests'));
    await act(async () => {
      window.history.replaceState(null, '', '#/bingo');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Nature Bingo');
  });

  it('recovers unknown routes through a working home link', async () => {
    window.history.replaceState(null, '', '#/missing');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe("Let's find our way home");
    expect(screen.getByRole('navigation').querySelector('[aria-current]')).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: 'Return home' }));
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Little explorer'));
  });

  it('skips to content without changing the hash route', () => {
    window.history.replaceState(null, '', '#/quests');
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Skip to content' }));
    expect(document.activeElement).toBe(screen.getByRole('main'));
    expect(window.location.hash).toBe('#/quests');
  });
});

