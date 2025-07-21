"use client";

import { useState } from "react";
import WalletGenerator from "@/components/wallet-generator";
import { SolanaWallet } from "@/components/solana-wallet";

export default function Home() {
  const [mnemonic, setMnemonic] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  return (
    // Main container with a dark background to fill the screen
    <div className="bg-gray-900 min-h-screen flex flex-col gap-4 items-center justify-center p-6 font-sans">
      <WalletGenerator mnemonic={mnemonic} setMnemonic={setMnemonic} isCopied={isCopied} setIsCopied={setIsCopied} />
      {/* <SolanaWallet mnemonic={mnemonic} /> */}
    </div>
  );
}
