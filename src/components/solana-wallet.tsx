import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// --- Helper Interfaces & Components ---

interface Wallet {
  publicKey: string;
  secretKey: Uint8Array;
}

const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


// --- Main Component ---

export function SolanaWallet({ mnemonic }: { mnemonic: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const handleAddWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);

    const newWallet: Wallet = {
      publicKey: keypair.publicKey.toBase58(),
      secretKey: keypair.secretKey,
    };

    setWallets([...wallets, newWallet]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleDeleteWallet = (publicKeyToDelete: string) => {
    setWallets(wallets.filter(w => w.publicKey !== publicKeyToDelete));
  };

  const handleDeleteAll = () => {
    setWallets([]);
    setCurrentIndex(0);
  };

  const togglePrivateKeyVisibility = (publicKey: string) => {
    setVisibleKeys(prev => ({ ...prev, [publicKey]: !prev[publicKey] }));
  };

  return (
    <div className="w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-sans bg-gray-900 text-white rounded-lg shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-solana-purple">Solana HD Wallet</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-solana-green hover:bg-solana-green-dark text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleAddWallet}
          >
            Add New Wallet
          </button>
          {wallets.length > 0 && (
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              onClick={handleDeleteAll}
            >
              Delete All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {wallets.map((wallet, index) => (
          <div key={wallet.publicKey} className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-400">Wallet #{index + 1} (Path: `m/44'/501'/${index}'/0'`)</p>
                <p className="text-lg font-mono break-all text-solana-aqua">{wallet.publicKey}</p>
              </div>
              <div className="flex items-center gap-3 mt-3 md:mt-0 md:ml-4">
                <button onClick={() => togglePrivateKeyVisibility(wallet.publicKey)} className="text-gray-400 hover:text-white transition duration-200">
                  {visibleKeys[wallet.publicKey] ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
                <button
                  type="button"
                  title="Delete Wallet"
                  onClick={() => handleDeleteWallet(wallet.publicKey)}
                  className="text-red-500 hover:text-red-400 transition duration-200"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            {visibleKeys[wallet.publicKey] && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-medium text-gray-400">Private Key (Base58)</p>
                <p className="text-md font-mono break-all text-red-400 bg-gray-900 p-2 rounded">{bs58.encode(wallet.secretKey)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-gray-500">
        <p>Total Wallets: {wallets.length}</p>
      </div>

      <style jsx>{`
        .text-solana-purple { color: #9945FF; }
        .text-solana-green { color: #14F195; }
        .text-solana-aqua { color: #00F0FF; }
        .bg-solana-green { background-color: #14F195; }
        .bg-solana-green-dark:hover { background-color: #0AD886; }
      `}</style>
    </div>
  );
}