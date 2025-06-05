import React, { useState } from "react";
import "./List.css";

export default function ListNFT() {
  const [activeTab, setActiveTab] = useState<"list" | "yourListings">("list");

  return (
    <div className="list-nft-container">
      <h2 className="list-nft-title">NFT Marketplace</h2>

      <div className="tab-wrapper">
        <button
          className={`tab-button ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          List NFT
        </button>
        <button
          className={`tab-button ${activeTab === "yourListings" ? "active" : ""}`}
          onClick={() => setActiveTab("yourListings")}
        >
          Your Listings
        </button>
      </div>
    
      <div className="tab-content-box">
        {activeTab === "list" ? (
          <div className="tab-content">📝 Form to list your NFT here.</div>
        ) : (
          <div className="tab-content">📦 NFTs you’ve listed on the marketplace.</div>
        )}
      </div>
    </div>
  );
}
