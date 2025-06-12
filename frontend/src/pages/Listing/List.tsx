import React, { useState, useEffect } from "react";
import NFTListForm from "./ListingForm";  
import YourListing from "./YourListing";
import "./List.css";
import { useWallet } from "../../hooks/useWallet";
import { NFT_ADDRESS } from "../../config";
//import { useMarketplace } from "../../hooks/useMarketplace";

export default function ListNFT() {
  const [activeTab, setActiveTab] = useState<"list" | "yourListings">("list");
  const { signer, provider, account } = useWallet();

  const nftAddress = NFT_ADDRESS;

  return (
    <div className="list-nft-container">
      <h2 className="list-nft-title">List NFT</h2>

      <div className="tab-wrapper">
        <button
          className={`tab-button ${activeTab === "list" ? "active" : ""}`}
          onClick={() => {setActiveTab("list");}}
        >
          List NFT
        </button>
        <button
          className={`tab-button ${activeTab === "yourListings" ? "active" : ""}`}
          onClick={() => {setActiveTab("yourListings");}}
        >
          Your Listings
        </button>
      </div>

      <div className="tab-content-box">
        {activeTab === "list" ? (
          <div className="tab-content">
            <NFTListForm signer={signer} provider={provider} nftAddress={nftAddress} account={account} />
          </div>
        ) : (
          <div className="tab-content">
            <YourListing signer={signer} provider={provider} nftAddress={nftAddress} account={account}/>
          </div>
        )}
      </div>
    </div>
  );
}
