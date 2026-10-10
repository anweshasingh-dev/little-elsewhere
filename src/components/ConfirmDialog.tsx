import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { Button } from './Button';
export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel, children, cancelLabel = 'Keep exploring' }: {
  open: boolean; title: string; description: string; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void; children?: ReactNode; cancelLabel?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); };
  }, [open]);
  return <dialog ref={ref} className="confirm-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={(event) => { event.preventDefault(); onCancel(); }}>
    <p className="eyebrow">Little Elsewhere</p><h2 id={`${id}-title`}>{title}</h2><p id={`${id}-description`}>{description}</p>{children}
    <div className="dialog-actions"><Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button><Button onClick={onConfirm}>{confirmLabel}</Button></div>
  </dialog>;
}
