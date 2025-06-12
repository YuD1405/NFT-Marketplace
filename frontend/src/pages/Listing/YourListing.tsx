// src/pages/Marketplace/YourListings.tsx
import React ,{ useState } from "react";
import { useNFT } from "../../hooks/useNFT";
import { useMarketplace } from "../../hooks/useMarketplace";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";
import { ListedCard } from "../../components/ListedCard/ListedCard";
import Loader from "../../components/Loader/Loader";
import "./YourListing.css";

interface Props {
  signer: ethers.JsonRpcSigner | any;
  provider: ethers.BrowserProvider | any;
  nftAddress: string;
  account: string | null;
}

export default function YourListing({ signer, provider, nftAddress, account }: Props) {
  //const { account } = useWallet();
  const { nfts } = useNFT(account, provider);
  const { listings, isFetching } = useMarketplace(signer, provider);
  const [selected, setSelected] = useState<typeof nfts[0] | null>(null);

  // Chỉ lấy các NFT của chính user
  const myListings = listings.filter(item => item.seller.toLowerCase() === account?.toLowerCase());

  return (
    <div className="your-listings">
      {!selected && (
      <>
        {isFetching ? (
          <Loader />
        ) : myListings.length === 0 ? (
          <p className="no-listings">😕 You haven't listed any NFTs yet.</p>
        ) : (
          <div className="listing-grid">
            {myListings.map(nft => (
              <div
                key={`${nft.nft}-${nft.tokenId}`}
                onClick={() => {
                  const found = nfts.find(
                    (item) => item.tokenId === nft.tokenId
                  );
                  if (found) {
                    setSelected(found);
                    const container = document.querySelector(".app-container");
                    if (container) container.scrollTo({ top: 0 });
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <ListedCard
                  key={`${nft.nft}-${nft.tokenId}`}
                  tokenId={nft.tokenId}
                  name={nft.name}
                  description={nft.description}
                  imageUrl={nft.image}
                  element={nft.element}
                  price={(Number(nft.price) / 1e18).toFixed(2)}
                  seller={nft.seller}
                  attributes={[]} // nếu cần, có thể truyền từ metadata
                />
              </div>
            ))}
          </div>
        )}
      </>
      )}

      {selected && (
        <div className="selected-nft-wrapper">
          <div className="selected-nft-card">
            {(() => {
              const listingInfo = myListings.find(l => l.tokenId === selected.tokenId);
              return (
                <ListedCard
                  tokenId={selected.tokenId}
                  name={selected.name}
                  description={selected.description}
                  imageUrl={selected.image}
                  element={selected.element}
                  price={(Number(listingInfo?.price || 0) / 1e18).toFixed(2)}
                  seller={listingInfo?.seller || ""}
                  attributes={selected.attributes}
                />
              );
            })()}
          </div>

          <div className="selected-nft-info">
            <h3>{selected.name}</h3>
            <p>
              <strong>Element:</strong> {selected.element}
            </p>
            <p>
              <strong>Rarity:</strong>{" "}
              {selected.attributes.find((attr) => attr.trait_type === "Rarity")?.value}
            </p>
            <p>
              <strong>Weapon Type:</strong>{" "}
              {selected.attributes.find((attr) => attr.trait_type === "Weapon Type")?.value}
            </p>
            <p>
              <strong>Skill:</strong>{" "}
              {selected.attributes.find((attr) => attr.trait_type === "Skill")?.value}
            </p>

            <div className="price-input-area">
              <button onClick={() => setSelected(null)}>🔙 Back to Listings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
