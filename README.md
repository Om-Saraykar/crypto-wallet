# Multi-Chain Crypto Wallet
A non-custodial, browser-based crypto wallet that allows you to generate a unique seed phrase to manage Ethereum and Solana accounts. Create new wallets, derive accounts, and view your balances in one place.


## ✨ Features
- Secure Seed Phrase Generation: Create a new 12-word BIP39 mnemonic seed phrase to serve as the master key for all your wallets.
- Multi-Chain Support:
  - Ethereum: Derive multiple Ethereum wallet addresses from your seed phrase.
  - Solana: Derive multiple Solana wallet addresses from your seed phrase.
- Balance Checker: View the native token balances (ETH and SOL) for your generated wallets in real-time.
- Non-Custodial: You have full control. Seed phrases and private keys are generated and stored only in your browser's session and are never sent to a server.


## 🛠️ Technologies Used
- **Frontend**: Next.js  
- **Ethereum**: Ethers.js  
- **Solana**: @solana/web3.js  
- **Key Derivation**: bip39, hdkey  
- **Styling**: Tailwind CSS


## ⭕ Disclaimer 
This wallet was built just for learning and experimenting with crypto tech. It’s not meant for storing real funds, and it hasn’t been security-audited — so please don’t use it for anything serious or valuable.