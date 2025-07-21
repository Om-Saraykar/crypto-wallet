import { useState } from "react"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl"

export function SolanaWallet({ mnemonic }: { mnemonic: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);

  return <div>
    <button 
      type="button" 
      className="bg-blue-500 text-white p-2 rounded-md cursor-pointer" 
      onClick={function () {
        const seed = mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString()).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        setCurrentIndex(currentIndex + 1);
        setPublicKeys([...publicKeys, keypair.publicKey]);
    }}>
      Add Solana wallet
    </button>
    {publicKeys.map(p => <div key={p.toBase58()}>
      {p.toBase58()}
    </div>)}
    <div>
      <p>Total wallets: {publicKeys.length}</p>
    </div>
  </div>
}