"use client";

import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { HDNodeWallet } from "ethers";
import { ethers } from "ethers";
import {
  EyeOpenIcon,
  EyeClosedIcon,
  TrashIcon,
  PlusIcon,
} from "@/components/icons";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { Loader2 } from "lucide-react";

interface EthDerivedWallet {
  address: string;
  privateKey: string;
  pathIndex: number;
  balance?: string;
  isLoading?: boolean;
}

export function EthWallet({ mnemonic }: { mnemonic: string }) {
  const [wallets, setWallets] = useState<EthDerivedWallet[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<EthDerivedWallet | null>(null);

  const handleAddWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const hdNode = HDNodeWallet.fromSeed(seed);
    const path = `m/44'/60'/${nextIndex}'/0'`;
    const child = hdNode.derivePath(path);
    const newWallet: EthDerivedWallet = {
      address: child.address,
      privateKey: child.privateKey,
      pathIndex: nextIndex,
    };

    if (wallets.some((w) => w.address === newWallet.address)) {
      console.warn("Duplicate ETH wallet detected, skipping.");
      return;
    }

    setWallets((prev) => [...prev, newWallet]);
    setNextIndex((prev) => prev + 1);
  };

  const handleDeleteWallet = (address: string) => {
    setWallets(wallets.filter((w) => w.address !== address));
    if (visibleKey === address) {
      setVisibleKey(null);
    }
  };

  const togglePrivateKeyVisibility = (address: string) => {
    setVisibleKey((prev) => (prev === address ? null : address));
  };

  const handleCheckBalance = async (address: string) => {
    setWallets((prev) =>
      prev.map((wallet) =>
        wallet.address === address ? { ...wallet, isLoading: true } : wallet
      )
    );

    try {
      const provider = ethers.getDefaultProvider(
        "https://eth-mainnet.g.alchemy.com/v2/rpfukgnxp68Bl1UKGfX3s00dnTOWK0eK"
      );
      const balanceBigInt = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balanceBigInt);

      setWallets((prev) =>
        prev.map((wallet) =>
          wallet.address === address
            ? { ...wallet, balance: balanceInEth, isLoading: false }
            : wallet
        )
      );
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setWallets((prev) =>
        prev.map((wallet) =>
          wallet.address === address
            ? { ...wallet, isLoading: false }
            : wallet
        )
      );
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gray-900/40 p-6 shadow-2xl backdrop-blur-lg md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Ethereum HD Wallet</h2>
        <button
          type="button"
          onClick={handleAddWallet}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-200 px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-inset ring-white/10 transition-all duration-300 hover:scale-101 hover:brightness-110 focus:outline-none cursor-pointer"
        >
          <span className="z-10 flex items-center gap-2">
            <PlusIcon className="h-5 w-5 text-gray-900" />
            Add Wallet
          </span>
          <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
        </button>
      </div>

      {/* Wallets List */}
      <div className="space-y-4">
        {wallets.length === 0 ? (
          <p className="text-center text-gray-500">
            No Ethereum wallets yet. Click "Add Wallet" to start.
          </p>
        ) : (
          wallets.map((wallet) => (
            <div
              key={wallet.address}
              className="animate-fade-in rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-gray-600"
            >
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                {/* Left: Wallet Details */}
                <div className="w-full md:flex-1">
                  <p className="truncate text-sm font-medium text-gray-400">
                    {`Wallet #${wallet.pathIndex + 1}`}{" "}
                    (<code>{`m/44'/60'/${wallet.pathIndex}'/0'`}</code>)
                  </p>
                  <p className="break-all font-mono text-lg sm:truncate">
                    {wallet.address}
                  </p>

                  {/* Balance or Loading */}
                  {wallet.isLoading ? (
                    <p className="mt-1 text-sm text-gray-400 flex items-center gap-2 font-mono">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking balance...
                    </p>
                  ) : wallet.balance ? (
                    <p className="mt-1 text-sm text-green-400 font-mono">
                      Balance: {wallet.balance} ETH
                    </p>
                  ) : null}

                  {/* Action Row: Check Balance + Eye + Delete */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    {/* Check Balance Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => handleCheckBalance(wallet.address)}
                        className="rounded-md border border-green-500 px-3 py-1 text-sm text-green-300 hover:bg-green-500/10 cursor-pointer w-max"
                      >
                        Check Balance
                      </button>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => togglePrivateKeyVisibility(wallet.address)}
                        className="text-gray-400 transition hover:text-white cursor-pointer"
                      >
                        {visibleKey === wallet.address ? <EyeClosedIcon /> : <EyeOpenIcon />}
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
                </div>
              </div>

              {/* Private Key */}
              {visibleKey === wallet.address && (
                <div className="animate-fade-in mt-4 rounded-md border-t-2 border-red-500/50 bg-gray-900/50 p-3">
                  <p className="text-sm font-bold text-red-400">Private Key</p>
                  <p className="break-all font-mono text-sm text-red-400">
                    {wallet.privateKey}
                  </p>
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
            handleDeleteWallet(walletToDelete.address);
            setWalletToDelete(null);
          }}
        />
      )}
    </div>
  );
}
