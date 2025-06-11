import React, { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { useNFT } from "../../hooks/useNFT";
import { useMarketplace } from "../../hooks/useMarketplace";
import { getNFTContract } from "../../hooks/useContracts";
import { ethers } from "ethers";
import { ListingCard } from "../../components/ListingCard/ListingCard";
import "./ListingForm.css";

interface Props {
  signer: ethers.JsonRpcSigner | null;
  provider: ethers.BrowserProvider | null;
  nftAddress: string;
}

export default function NFTListForm({ signer, provider, nftAddress }: Props) {
  const { account } = useWallet();
  const { nfts } = useNFT();
  const { listings ,fetchAllListings } = useMarketplace(signer, provider);
  const [selected, setSelected] = useState<typeof nfts[0] | null>(null);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleList = async () => {
    if (!signer || !selected || !price || !nftAddress) return;
    try {
      setLoading(true);

      const marketplace = await import("../../hooks/useContracts").then((m) =>
        m.getMarketplaceContract(signer)
      );
      const nft = getNFTContract(signer);
      const approved = await nft.getApproved(selected.tokenId);

      if ((approved as string).toLowerCase() !== (marketplace.target as string).toLowerCase()) {
        const txApprove = await nft.approve(marketplace.target, selected.tokenId);
        await txApprove.wait();
      }

      const tx = await marketplace.listNFT(
        nftAddress,
        selected.tokenId,
        ethers.parseEther(price)
      );
      await tx.wait();

      alert("✅ NFT listed successfully!");

      await fetchAllListings(); // thêm dòng này
      
      setSelected(null);
      setPrice("");
    } catch (err) {
      console.error("❌ List NFT failed:", err);
      alert("❌ Failed to list NFT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-form">

      {!selected && (
        <div className="nft-grid">
          {nfts.map((nft) => {
            const isListed = listings.some(
              (listed) =>
                listed.tokenId === nft.tokenId &&
                listed.nft.toLowerCase() === nftAddress.toLowerCase()
            );

            return (
              <div
                key={nft.tokenId}
                onClick={() => {
                  if (!isListed) {
                    setSelected(nft);
                    const container = document.querySelector(".app-container");
                    if (container) container.scrollTo({ top: 0 });
                  }
                }}
                className={isListed ? "nft-card-disabled" : ""}
                style={{ cursor: isListed ? "not-allowed" : "pointer" }}
              >
                <ListingCard
                  tokenId={nft.tokenId}
                  name={nft.name}
                  description={nft.description}
                  imageUrl={nft.image}
                  element={nft.element}
                  attributes={nft.attributes}
                  disabled={isListed} 
                />
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="selected-nft-wrapper">
          <div className="selected-nft-card">
            <ListingCard
              tokenId={selected.tokenId}
              name={selected.name}
              description={selected.description}
              imageUrl={selected.image}
              element={selected.element}
              attributes={selected.attributes}
            />
          </div>

          <div className="selected-nft-info">
            <h3>{selected.name}</h3>
            <p><strong>Element:</strong> {selected.element}</p>
            <p><strong>Rarity:</strong> {selected.attributes.find(attr => attr.trait_type === "Rarity")?.value}</p>
            <p><strong>Weapon Type:</strong> {selected.attributes.find(attr => attr.trait_type === "Weapon Type")?.value}</p>
            <p><strong>Skill:</strong> {selected.attributes.find(attr => attr.trait_type === "Skill")?.value}</p>

            <div className="price-input-area">
              <input
                type="number"
                placeholder="💰 Price in ETH"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <div className="form-buttons">
                <button onClick={() => setSelected(null)}>🔙 Choose Another</button>
                <button disabled={loading || !price} onClick={handleList}>
                  {loading ? "Listing..." : "List NFT"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
