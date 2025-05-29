import React from "react";
import { useWallet } from "../hooks/useWallet";
import { shortenAddress } from "../utils/shortAddress";

export default function ConnectWalletPage() {
  const { account, connect } = useWallet();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🔐 Kết nối ví của bạn</h1>
      <p>Để sử dụng marketplace, vui lòng kết nối với ví Ethereum (MetaMask).</p>

      <button
        onClick={connect}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1.1rem",
          marginTop: "1rem",
        }}
      >
        {account
          ? `Đã kết nối: ${shortenAddress(account)}`
          : "🔗 Kết nối MetaMask"}
      </button>
    </div>
  );
}
