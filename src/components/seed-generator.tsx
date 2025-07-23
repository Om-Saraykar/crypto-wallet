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

    // Modern API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(mnemonic).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      const textArea = document.createElement("textarea");
      textArea.value = mnemonic;
      textArea.style.position = "fixed"; // avoid scrolling to bottom
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } else {
          alert("Copy failed. Please copy manually.");
        }
      } catch (err) {
        alert("Copy not supported. Please copy manually.");
      }

      document.body.removeChild(textArea);
    }
  };


  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gray-900/40 p-6 shadow-2xl backdrop-blur-lg md:p-8 transition-all">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Seed Phrase Generator</h1>
        <p className="mt-2 text-gray-400">Your key to a non-custodial wallet.</p>
      </div>

      {!mnemonic && (
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            disabled={isGenerating}
            className={clsx(
              "relative group flex items-center justify-center gap-2 overflow-hidden rounded-lg px-6 py-3 font-bold text-gray-900 shadow-lg ring-1 ring-inset ring-white/10 transition-all duration-300 focus:outline-none",
              isGenerating
                ? "bg-gradient-to-br from-[#14F195] to-[#00F0FF] cursor-not-allowed"
                : "bg-gradient-to-br from-[#14F195] to-[#00F0FF] hover:scale-105 hover:brightness-110"
            )}
            onClick={handleGenerateMnemonic}
          >
            <span className="z-10 flex items-center gap-2">
              <SparklesIcon className={clsx("h-5 w-5 mb-[2px]", isGenerating && "animate-spin")} />
              {isGenerating ? "Generating..." : "Generate Secure Phrase"}
            </span>
            {!isGenerating && (
              <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
            )}
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
