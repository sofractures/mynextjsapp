'use client';

import { useState, useEffect } from 'react';
import { ZDK } from '@zoralabs/zdk';
import { ethers } from 'ethers';

const zdk = new ZDK({
  endpoint: 'https://api.zora.co/graphql',
  networks: [{ network: 'mainnet' }],
});

export default function FarcasterFrame() {
  const [message, setMessage] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [metadata, setMetadata] = useState(null);

  const collectionAddress = '0x0d41f57ca76892275531e7f02ed72c1c9208c28d';
  const tokenId = '57';

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      setWalletConnected(true);
      fetchMetadata(); // Fetch metadata after connecting wallet
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchMetadata = async () => {
    try {
      const response = await zdk.getTokenMetadata({
        collection: collectionAddress,
        tokenId: tokenId,
      });
      setMetadata(response);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setMessage('Error fetching metadata.');
    }
  };

  const handleCollect = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      const response = await zdk.mint({
        to: address, // Use the connected wallet address
        tokenId: tokenId, // Your token ID
        quantity: 1,
        collection: collectionAddress, // Your collection address
      });
      setMessage('NFT collected successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Error collecting NFT.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Collect Your Zora NFT</h1>
      <button onClick={connectWallet}>
        {walletConnected ? "Wallet Connected" : "Connect Wallet"}
      </button>
      <button onClick={handleCollect} disabled={!walletConnected}>
        Collect
      </button>
      {metadata && (
        <div>
          <h2>Metadata:</h2>
          <p>Name: {metadata.name}</p>
          <p>Description: {metadata.description}</p>
          <img src={metadata.image} alt={metadata.name} style={{ width: '200px' }} />
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}