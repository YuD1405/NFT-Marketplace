// src/pages/MyNFTs.tsx

import React, { useEffect } from "react";
import { useNFT } from "../hooks/useNFT";
import { useWallet } from "../hooks/useWallet";
import { Navigate } from "react-router-dom";
import { NFTCard } from "../components/NFTCard";
import "./MyNFTs.css";

export default function MyNFTs() {
  const { account } = useWallet();
  const { nfts, fetchMyNFTs, mint, loading } = useNFT();

  useEffect(() => {
    if (account) {
      fetchMyNFTs();
    }
  }, [account, fetchMyNFTs]);

  // if (!account) {
  //   return <Navigate to="/connect" replace />;
  // }

  return (
    <div className="my-nfts-container">
      <div className="my-nfts-content">
        <h2 className="my-nfts-title">My NFTs</h2>

        <button onClick={mint} disabled={loading} className="my-nfts-button">
          {loading ? "Processing..." : "Mint NFT"}
        </button>

        {loading && nfts.length === 0 && (
          <p style={{ color: "#00e5ff", textAlign: "center" }}>Loading NFTs…</p>
        )}

        {!loading && nfts.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#ccc" }}>
            No NFTs found.
          </p>
        )}

        <div className="my-nfts-list">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.tokenId}
              tokenId={nft.tokenId}
              name={nft.name}
              description={nft.description}
              imageUrl={nft.image}
              element={nft.element} // truyền thêm element
            />
          ))}
        </div>
      </div>
    </div>
  );
}
