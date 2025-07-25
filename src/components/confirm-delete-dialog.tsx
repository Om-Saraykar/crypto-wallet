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
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-xl transition-all duration-300">
          <Dialog.Title className="text-base font-semibold text-white">
            Delete Wallet
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-mono text-red-400">{walletLabel}</span>?<br />
            This action cannot be undone.
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-150"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-md bg-red-500/80 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors duration-150"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
