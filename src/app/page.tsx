"use client";

import { useState } from "react";
import SeedGenerator from "@/components/seed-generator";
import { SolanaWallet } from "@/components/solana-wallet";

export default function Home() {
  const [mnemonic, setMnemonic] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col gap-4 items-center justify-center p-6 font-sans">
      <SeedGenerator
        mnemonic={mnemonic}
        setMnemonic={setMnemonic}
        isCopied={isCopied}
        setIsCopied={setIsCopied}
      />

      {mnemonic ? (
        <SolanaWallet mnemonic={mnemonic} />
      ) : (
        <div className="text-center text-white mt-4 text-sm opacity-70">
          Please generate a seed phrase to view Solana wallets.
        </div>
      )}
    </div>
  );
}
