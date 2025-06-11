// src/pages/Marketplace/YourListings.tsx
import React from "react";
import { useMarketplace } from "../../hooks/useMarketplace";
import { useWallet } from "../../hooks/useWallet";
import { ListedCard } from "../../components/ListedCard/ListedCard";
import Loader from "../../components/Loader/Loader";
import "./YourListing.css";

interface Props {
  signer: any;
  provider: any;
  nftAddress: string;
}

export default function YourListing({ signer, provider, nftAddress }: Props) {
  const { account } = useWallet();
  const { listings, isFetching } = useMarketplace(signer, provider);
  
  // Chỉ lấy các NFT của chính user
  const myListings = listings.filter(item => item.seller.toLowerCase() === account?.toLowerCase());

  return (
    <div className="your-listings">
      {isFetching ? (
        <Loader />
      ) : myListings.length === 0 ? (
        <p className="no-listings">😕 You haven't listed any NFTs yet.</p>
      ) : (
        <div className="listing-grid">
          {myListings.map(nft => (
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
          ))}
        </div>
      )}
    </div>
  );
}
