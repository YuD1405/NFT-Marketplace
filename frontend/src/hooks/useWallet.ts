// src/hooks/useWallet.ts

import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

// Khai báo global để TypeScript không complain khi dùng window.ethereum
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [initialized, setInitialized] = useState(false);

  // 1. Khi hook mount, kiểm tra xem MetaMask có lưu account nào sẵn hay không
  useEffect(() => {
    const checkConnected = async () => {
      if (window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          // "eth_accounts" trả về mảng account đã connect (hoặc rỗng nếu chưa)
          const accounts: string[] = await browserProvider.send("eth_accounts", []);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setProvider(browserProvider);
            const s = await browserProvider.getSigner();
            setSigner(s);
            console.log("✅ Đã kết nối với account:", accounts[0]);
          }
        } catch (error) {
          console.error("Error when checking connected accounts:", error);
        } finally {
          setInitialized(true);
        }
      } else {
        // Nếu không có window.ethereum, vẫn cần đánh dấu đã hoàn thành check
        setInitialized(true);
      }
    };

    checkConnected();
  }, []);

  // 2. Hàm connect wallet khi user bấm nút
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("⚠️ Vui lòng cài MetaMask trước khi sử dụng");
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      // Yêu cầu MetaMask cung cấp account
      const accounts: string[] = await browserProvider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setProvider(browserProvider);
        const s = await browserProvider.getSigner();
        setSigner(s);
        console.log("✅ Wallet kết nối với:", accounts[0]);
      }
    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
    }
  }, []);

  // 3. Lắng nghe khi user đổi account hoặc đổi network
  useEffect(() => {
    if (!window.ethereum) return;

    const ethAny = window.ethereum as any;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User đã disconnect ví
        setAccount(null);
        setProvider(null);
        setSigner(null);
      } else {
        // Cập nhật lại account
        setAccount(accounts[0]);
        const browserProvider = new ethers.BrowserProvider(window.ethereum!);
        setProvider(browserProvider);
        const s = await browserProvider.getSigner();
        setSigner(s);
      }
    };

    const handleChainChanged = async (_chainIdHex: string) => {
      // Khi đổi network, reload lại provider & signer
      const browserProvider = new ethers.BrowserProvider(window.ethereum!);
      setProvider(browserProvider);
      const s = await browserProvider.getSigner();
      setSigner(s);
    };

    ethAny.on("accountsChanged", handleAccountsChanged);
    ethAny.on("chainChanged", handleChainChanged);

    return () => {
      if (ethAny.removeListener) {
        ethAny.removeListener("accountsChanged", handleAccountsChanged);
        ethAny.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return { account, provider, signer, connect, initialized };
}
