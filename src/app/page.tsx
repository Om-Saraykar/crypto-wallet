"use client";

import { useState } from "react";
import SeedGenerator from "@/components/seed-generator";
import { SolanaWallet } from "@/components/solana-wallet";
import { EthWallet } from "@/components/eth-wallet";

export default function Home() {
  const [mnemonic, setMnemonic] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  return (
    <main className="main-bg flex min-h-screen w-full flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[680px] flex flex-col gap-8">
        <SeedGenerator
          mnemonic={mnemonic}
          setMnemonic={setMnemonic}
          isCopied={isCopied}
          setIsCopied={setIsCopied}
        />

        {mnemonic ? (
          <>
            <div className="animate-fade-in">
              <SolanaWallet mnemonic={mnemonic} />
            </div>
            <div className="animate-fade-in">
              <EthWallet mnemonic={mnemonic} />
            </div>
          </>
        ) : (
          <div className="text-center text-sm text-gray-500">
            Generate a seed phrase to create and manage wallets.
          </div>
        )}
      </div>
    </main>
  );
}