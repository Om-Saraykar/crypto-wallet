"use client";

import { Dialog } from "@headlessui/react";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  walletLabel: string;
}

export function ConfirmDeleteDialog({
  isOpen,
  onCancel,
  onConfirm,
  walletLabel,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-md w-full rounded-xl bg-gray-800 p-6 shadow-xl border border-white/10">
          <Dialog.Title className="text-lg font-semibold text-white">
            Delete Wallet
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-300">
            Are you sure you want to delete <span className="font-mono text-red-400">{walletLabel}</span>?
            This action cannot be undone.
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
