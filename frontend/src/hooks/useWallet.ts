import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Khai báo chuẩn cho window.ethereum
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    const checkConnected = async () => {
      if (window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(browserProvider);
        }
      }
    };

    checkConnected();
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      alert("⚠️ Please install MetaMask");
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setProvider(browserProvider);
    } catch (err) {
      console.error("❌ Wallet connection failed", err);
    }
  };

  return { account, provider, connect };
}
