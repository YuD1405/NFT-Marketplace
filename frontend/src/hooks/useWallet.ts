// src/hooks/useWallet.ts

import { useEffect, useState, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { showToast } from "../components/Toast/ToastContainer";
import { extractErrorMessage } from "../components/Toast/ToastUtils";
import  { shortenAddress } from "../utils/shortAddress";

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
  const hasAttachedListeners = useRef(false);

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
            //console.log("✅ Connected to account:", accounts[0]);
            //const msg = "Connected to account: " + accounts[0];
            //showToast(msg, "success");
          }
        } catch (error) {
          console.error("Error when checking connected accounts:", error);
          const msg = "Error when checking connected accounts: " + extractErrorMessage(error);
          showToast(msg, "error");
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
      //alert("⚠️ Vui lòng cài MetaMask trước khi sử dụng");
      const msg = "Please install MetaMask before using this application";
      showToast(msg, "error");
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
        const msg = "Wallet connected to: " +  shortenAddress(accounts[0]);
        showToast(msg, "success");
        console.log("✅ Wallet connected to:", shortenAddress(accounts[0]));
      }
    } catch (err) {
      const msg = "Wallet connection failed: " + extractErrorMessage(err);
      showToast(msg, "error");
      console.error("❌ Wallet connection failed:", err);
    }
  }, []);

  // 3. Lắng nghe khi user đổi account hoặc đổi network
  useEffect(() => {
    if (!window.ethereum || hasAttachedListeners.current) return;

    const ethAny = window.ethereum as any;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setProvider(null);
        setSigner(null);
      } else {
        setAccount(accounts[0]);
        const browserProvider = new ethers.BrowserProvider(window.ethereum!);
        setProvider(browserProvider);
        const s = await browserProvider.getSigner();
        setSigner(s);
        showToast("Account changed to: " + shortenAddress(accounts[0]), "info");
      }
    };

    const handleChainChanged = async (_chainIdHex: string) => {
      const browserProvider = new ethers.BrowserProvider(window.ethereum!);
      setProvider(browserProvider);
      const s = await browserProvider.getSigner();
      setSigner(s);
    };

    ethAny.on("accountsChanged", handleAccountsChanged);
    ethAny.on("chainChanged", handleChainChanged);

    hasAttachedListeners.current = true;

    return () => {
      if (ethAny.removeListener) {
        ethAny.removeListener("accountsChanged", handleAccountsChanged);
        ethAny.removeListener("chainChanged", handleChainChanged);
        hasAttachedListeners.current = false; // reset nếu cần unmount
      }
    };
  }, []);

  return { account, provider, signer, connect, initialized };
}
