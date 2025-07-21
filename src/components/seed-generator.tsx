"use client";

import { generateMnemonic } from "bip39";

// A simple SVG icon for the copy button
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

// A simple SVG icon for the checkmark when copied
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-400">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

interface WalletGeneratorProps {
  mnemonic: string;
  setMnemonic: (mnemonic: string) => void;
  isCopied: boolean;
  setIsCopied: (isCopied: boolean) => void;
}

export default function SeedGenerator({ mnemonic, setMnemonic, isCopied, setIsCopied }: WalletGeneratorProps) {

  // Function to generate a new mnemonic
  const handleGenerateMnemonic = () => {
    setMnemonic(generateMnemonic());
    setIsCopied(false); // Reset copied state when new mnemonic is generated
  };

  // Function to copy the mnemonic to the clipboard
  const handleCopy = () => {
    if (!mnemonic) return;

    // Use the older execCommand for broader compatibility, especially in iFrames
    const textArea = document.createElement("textarea");
    textArea.value = mnemonic;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      setIsCopied(true);
      // Reset the "Copied!" message after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }

    document.body.removeChild(textArea);
  };

  return (

    <>
      {/* The main card component */}
      <div className="w-full max-w-2xl h-full bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 text-white flex flex-col gap-8">

        {/* Header section */}
        <div className="text-center mt-2">
          <h1 className="text-3xl md:text-4xl font-bold">Wallet Generator</h1>
          <p className="text-gray-400 mt-2">Create your secure, non-custodial wallet.</p>
        </div>

        {/* Generate Button */}
        {!mnemonic && (
          <button
            type="button"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-purple-500/50 cursor-pointer"
            onClick={handleGenerateMnemonic}
          >
            Generate Mnemonic
          </button>
        )}


        {/* Mnemonic display area - only shows after generation */}
        {mnemonic && (
          <div className="space-y-6">
            {/* Security Warning */}
            <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg" role="alert">
              <p className="font-bold">🚨 Important: Secure Your Phrase!</p>
              <p className="text-sm">Write this phrase down and store it in a safe, offline location. Never share it with anyone. This is the master key to your wallet.</p>
            </div>

            {/* The Mnemonic grid with a copy button */}
            <div className="bg-gray-900 rounded-lg p-4 md:p-6 relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mnemonic.split(' ').map((word, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex items-center">
                    <span className="text-sm font-semibold text-gray-500 w-6 text-right mr-2">{index + 1}.</span>
                    <span className="font-mono text-base text-green-400">{word}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Copy mnemonic"
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
