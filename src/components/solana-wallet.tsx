"use client";

import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { EyeOpenIcon, EyeClosedIcon, TrashIcon, PlusIcon } from "@/components/icons";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

interface Wallet {
  publicKey: string;
  secretKey: Uint8Array;
  pathIndex: number;
}

export function SolanaWallet({ mnemonic }: { mnemonic: string }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null);

  const handleAddWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${nextIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    const publicKey = keypair.publicKey.toBase58();

    if (wallets.some(w => w.publicKey === publicKey)) {
      console.warn("Duplicate wallet detected, skipping.");
      return;
    }

    const newWallet: Wallet = {
      publicKey,
      secretKey: keypair.secretKey,
      pathIndex: nextIndex,
    };

    setWallets(prev => [...prev, newWallet]);
    setNextIndex(prev => prev + 1);
  };

  const handleDeleteWallet = (publicKeyToDelete: string) => {
    setWallets(wallets.filter(w => w.publicKey !== publicKeyToDelete));
    if (visibleKey === publicKeyToDelete) {
      setVisibleKey(null);
    }
  };

  const togglePrivateKeyVisibility = (publicKey: string) => {
    setVisibleKey(prev => (prev === publicKey ? null : publicKey));
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gray-900/40 p-6 shadow-2xl backdrop-blur-lg md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-solana-purple">Solana HD Wallet</h2>
        <button
          type="button"
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-br from-[#14F195] to-[#00F0FF] px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-inset ring-white/10 transition-all duration-300 hover:scale-101 hover:brightness-110 focus:outline-none cursor-pointer"
          onClick={handleAddWallet}
        >
          <span className="z-10 flex items-center gap-2">
            <PlusIcon className="h-5 w-5 text-gray-900" />
            Add Wallet
          </span>
          <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
        </button>
      </div>

      {/* Wallets or Empty Message */}
      <div className="space-y-4">
        {wallets.length === 0 ? (
          <p className="text-center text-gray-500">No wallets derived yet. Click "Add Wallet" to begin.</p>
        ) : (
          wallets.map(wallet => (
            <div
              key={wallet.publicKey}
              className="animate-fade-in rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-gray-600"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-400">
                    {`Wallet #${wallet.pathIndex + 1}`} (<code>{`m/44'/501'/${wallet.pathIndex}'/0'`}</code>)
                  </p>
                  <p className="break-all font-mono text-lg text-solana-aqua sm:truncate">
                    {wallet.publicKey}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => togglePrivateKeyVisibility(wallet.publicKey)}
                    className="text-gray-400 transition hover:text-white cursor-pointer"
                  >
                    {visibleKey === wallet.publicKey ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                  <button
                    type="button"
                    title="Delete Wallet"
                    onClick={() => setWalletToDelete(wallet)}
                    className="text-gray-500 transition hover:text-red-500 cursor-pointer"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>

              {visibleKey === wallet.publicKey && (
                <div className="animate-fade-in mt-4 rounded-md border-t-2 border-red-500/50 bg-gray-900/50 p-3">
                  <p className="text-sm font-bold text-red-400">Private Key (Base58)</p>
                  <p className="break-all font-mono text-sm text-red-400">{bs58.encode(wallet.secretKey)}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {walletToDelete && (
        <ConfirmDeleteDialog
          isOpen={!!walletToDelete}
          walletLabel={`Wallet #${walletToDelete.pathIndex + 1}`}
          onCancel={() => setWalletToDelete(null)}
          onConfirm={() => {
            handleDeleteWallet(walletToDelete.publicKey);
            setWalletToDelete(null);
          }}
        />
      )}
    </div>
  );
}
