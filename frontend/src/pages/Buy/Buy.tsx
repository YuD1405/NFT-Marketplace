import React, { useState } from "react";
import { BuyingCard } from "../../components/BuyingCard/BuyingCard";
import "./Buy.css";
import { useWallet } from "../../hooks/useWallet";
import { useMarketplace } from "../../hooks/useMarketplace";
import Loader from "../../components/Loader/Loader";

export default function Buy() {
  const { signer, provider } = useWallet();
  const { listings, isFetching, isBuying, buyNFT } = useMarketplace(signer, provider);
  const [selectedNFT, setSelectedNFT] = useState<typeof listings[0] | null>(null);

  return (
    <div className="buy-container">
      <h2 className="buy-title">NFT Marketplace</h2>

      {isFetching ? (
        <Loader />
      ) : !selectedNFT ? (
        <div className="buy-list">
          {listings.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#ccc" }}>
              No NFTs available for purchase.
            </p>
          ) : (
            listings.map((item) => (
              <BuyingCard
                key={`${item.nft}-${item.tokenId}`}
                name={item.name}
                image={item.image}
                element={item.element}
                rarity={item.rarity}
                skill={item.skill}
                price={(Number(item.price) / 1e18).toFixed(2)}
                seller={item.seller}
                onBuy={() => setSelectedNFT(item)}
                disabled={isBuying}
              />
            ))
          )}
        </div>
      ) : (
        <div className="buy-selected-wrapper">
          <div className="buy-selected-card">
            <BuyingCard
              name={selectedNFT.name}
              image={selectedNFT.image}
              element={selectedNFT.element}
              rarity={selectedNFT.rarity}
              skill={selectedNFT.skill}
              price={(Number(selectedNFT.price) / 1e18).toFixed(2)}
              seller={selectedNFT.seller}
              onBuy={() => buyNFT(selectedNFT.nft, selectedNFT.tokenId, selectedNFT.price)}
              disabled={isBuying}
            />
          </div>

          <div className="buy-selected-info">
            <h3 style={{ color: "#ffd700" }}>{selectedNFT.name}</h3>
            <p><strong>Element:</strong> {selectedNFT.element}</p>
            <p><strong>Rarity:</strong> {selectedNFT.rarity}</p>
            <p><strong>Price:</strong> {(Number(selectedNFT.price) / 1e18).toFixed(2)} ETH</p>
            <p><strong>Skill:</strong> {selectedNFT.skill}</p>
            <p><strong>Seller:</strong> {selectedNFT.seller}</p>

            <div className="form-buttons">
              <button onClick={() => setSelectedNFT(null)}>🔙 Choose Another</button>
              <button disabled={isBuying} onClick={() =>
                buyNFT(selectedNFT.nft, selectedNFT.tokenId, selectedNFT.price)
              }>
                {isBuying ? "Processing..." : "Confirm Buy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}