import React, { useEffect, useState } from "react";
import { useNFT } from "../../hooks/useNFT";
import { useWallet } from "../../hooks/useWallet";
import { Navigate } from "react-router-dom";
import { NFTCard } from "../../components/NFTCard/NFTCard";
import { AttributeBox } from "../../components/AttributeBox/AttributeBox";
import "./MyNFTs.css";
import Loader from "../../components/Loader/Loader";
import { estimatePrice } from "../../utils/estimatePrice";

export default function MyNFTs() {
  const { account, provider, initialized } = useWallet();
  const { nfts, fetchMyNFTs, mint, loading } = useNFT(account, provider);
  const [selectedNFT, setSelectedNFT] = useState<typeof nfts[0] | null>(null);

  useEffect(() => {
    if (account) {
      fetchMyNFTs();
    }
  }, [account, fetchMyNFTs]);

  if (!initialized) return null;
  if (!account) return <Navigate to="/connect" replace />;

  return (
    <div className="my-nfts-container">
      <div className="my-nfts-content">
        <h2 className="my-nfts-title">My NFTs</h2>

        {!selectedNFT ? (
          <>
            <button onClick={mint} disabled={loading} className="my-nfts-button">
              {loading ? "Processing..." : "Mint NFT"}
            </button>

            {loading && nfts.length === 0 && <Loader />}

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
                  element={nft.element}
                  onClick={() => {
                    setSelectedNFT(nft);
                    const container = document.querySelector(".app-container");
                    if (container) {
                      container.scrollTo({ top: 0 });
                    }
                  }}
                  attributes={nft.attributes}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="my-selected-nft-wrapper">
            <div className="my-selected-nft-card">
              <NFTCard
                tokenId={selectedNFT.tokenId}
                name={selectedNFT.name}
                description={selectedNFT.description}
                imageUrl={selectedNFT.image}
                element={selectedNFT.element}
                attributes={selectedNFT.attributes}
              />
            </div>

            <div className="my-selected-nft-info">
              <h3 style={{ color: "#ffd700", marginBottom: "1rem" }}>{selectedNFT.name}</h3>

              {(() => {
                const get = (key: string) =>
                selectedNFT.attributes.find(attr => attr.trait_type === key)?.value ?? "Unknown";
                const price = estimatePrice(selectedNFT.attributes); 
                
                return (
                  <>
                    <div className="nft-attribute-boxes">
                      <AttributeBox label="Element" value={selectedNFT.element} />
                      <AttributeBox label="Rarity" value={get("Rarity")} />
                      <AttributeBox label="Weapon Type" value={get("Weapon Type")} />
                      <AttributeBox label="Skill" value={get("Skill")} />
                    </div>

                    <p><strong>Estimate Price:</strong> {price} ETH</p>

                    <div className="form-buttons">
                      <button onClick={() => setSelectedNFT(null)}>🔙 Choose Another</button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
