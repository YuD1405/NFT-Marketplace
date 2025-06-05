import React, { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { shortenAddress } from "../../utils/shortAddress";
import Loader from "../../components/Loader/Loader";
import "./ConnectWallet.css";

export default function ConnectWalletPage() {
  const { account, connect } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connect();
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connect-wallet-page">
      <div className="connect-wallet-card">
        <div className="connect-icon-title">
          <span role="img" aria-label="lock" className="emoji-lock">🔐</span>
          <h1 className="connect-title">Connect Your Wallet</h1>
        </div>
        <p className="connect-description">
          To explore the elemental marketplace, please connect your Ethereum wallet.
        </p>

        {loading ? (
          <Loader />
        ) : (
          <button
            className={`connect-wallet-button ${account ? "connected" : ""}`}
            onClick={handleConnect}
            disabled={!!account}
          >
            {account
              ? `CONNECTED: ${shortenAddress(account)}`
              : "🔗 Connect MetaMask"}
          </button>
        )}
      </div>
    </div>
  );
}
