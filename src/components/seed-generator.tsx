"use client";

import { generateMnemonic } from "bip39";
import { CheckIcon, CopyIcon, SparklesIcon } from "@/components/icons";
import { useState } from "react";
import clsx from "clsx";

interface WalletGeneratorProps {
  mnemonic: string;
  setMnemonic: (mnemonic: string) => void;
  isCopied: boolean;
  setIsCopied: (isCopied: boolean) => void;
}

export default function SeedGenerator({
  mnemonic,
  setMnemonic,
  isCopied,
  setIsCopied,
}: WalletGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMnemonic = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setMnemonic(generateMnemonic());
      setIsCopied(false);
      setIsGenerating(false);
    }, 500); // short delay to give animation time
  };

  const handleCopy = () => {
    if (!mnemonic) return;
    navigator.clipboard.writeText(mnemonic).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gray-900/40 p-6 shadow-2xl backdrop-blur-lg md:p-8 transition-all">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Seed Phrase Generator</h1>
        <p className="mt-2 text-gray-400">Your key to a non-custodial wallet.</p>
      </div>

      {!mnemonic && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={isGenerating}
            className={clsx(
              "group flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 cursor-pointer",
              isGenerating ? "bg-purple-800 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            )}
            onClick={handleGenerateMnemonic}
          >
            <SparklesIcon className={isGenerating ? "animate-spin" : ""} />
            {isGenerating ? "Generating..." : "Generate Secure Phrase"}
          </button>
        </div>
      )}

      {mnemonic && (
        <div className="animate-fade-in mt-8 space-y-6 transition-all duration-500">
          {/* Security Warning */}
          <div className="rounded-lg border border-yellow-700 bg-yellow-900/30 p-4" role="alert">
            <p className="font-bold text-yellow-300">🚨 Secure Your Phrase!</p>
            <p className="mt-1 text-sm text-yellow-400">
              Store this phrase in a safe, offline location. Never share it. This is the master key to your funds.
            </p>
          </div>

          {/* Mnemonic Grid */}
          <div className="relative rounded-lg bg-gray-900/70 p-4 md:p-6 shadow-inner">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {mnemonic.split(" ").map((word, index) => (
                <div key={index} className="flex items-center rounded-md bg-gray-800 p-2">
                  <span className="w-6 text-right text-sm font-medium text-gray-500">{index + 1}.</span>
                  <span className="ml-2 font-mono text-base text-teal-300">{word}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 text-gray-300 transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Copy mnemonic"
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
