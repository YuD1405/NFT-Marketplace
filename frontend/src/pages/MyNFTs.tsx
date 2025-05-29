import React, { useEffect } from "react";
import { useNFT } from "../hooks/useNFT";
import { useWallet } from "../hooks/useWallet";
import { Navigate } from "react-router-dom";

export default function MyNFTs() {
  const { account } = useWallet();
  const { nfts, fetchMyNFTs, mint, loading } = useNFT();

  // ✅ Hook luôn được gọi, điều kiện xử lý bên trong useEffect
  useEffect(() => {
    if (account) {
      fetchMyNFTs();
    }
  }, [account, fetchMyNFTs]); // ✅ thêm fetchMyNFTs để tránh warning

  // ✅ Điều kiện trong JSX, không bao quanh hook
  if (!account) return <Navigate to="/connect" replace />;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🎨 My NFTs</h2>

      <button onClick={mint} disabled={loading}>
        {loading ? "Minting..." : "Mint NFT"}
      </button>

      <div
        className="nft-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {nfts.length === 0 && <p>No NFTs found.</p>}
        {nfts.map((nft, i) => (
          <div
            key={i}
            className="nft-card"
            style={{ border: "1px solid #ccc", padding: "1rem", width: "200px" }}
          >
            <img src={nft.image} alt={nft.name} style={{ width: "100%", height: "auto" }} />
            <h3>{nft.name}</h3>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>{nft.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
