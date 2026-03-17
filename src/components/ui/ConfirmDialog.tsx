'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={body}>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          onClick={handleConfirm}
          className={cn(
            variant === 'danger' &&
              'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
          )}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
