import React, { useState } from "react";
import { ListingCard } from "../../components/ListingCard/ListingCard";
import "./Buy.css";

export default function Buy() {
  // Dữ liệu giả, mock listings để hiển thị giao diện
  const [listings] = useState([
    {
      nft: "0xAbc123...def",
      tokenId: 1,
      price: BigInt("1000000000000000000"), // 1 ETH
      seller: "0xSellerAddress123",
    },
    {
      nft: "0xDef456...abc",
      tokenId: 2,
      price: BigInt("500000000000000000"), // 0.5 ETH
      seller: "0xAnotherSeller456",
    },
  ]);

  const [isBuying, setIsBuying] = useState(false);

  // fake function mua NFT, chỉ để demo UI
  const buyNFT = async (nftAddress: string, tokenId: number, price: bigint) => {
    setIsBuying(true);
    await new Promise((r) => setTimeout(r, 1500)); // fake delay
    alert(`Fake mua NFT #${tokenId} tại ${nftAddress} với giá ${Number(price) / 1e18} ETH`);
    setIsBuying(false);
  };

  return (
    <div className="buy-container">
      <div className="buy-content">
        <h2 className="buy-title">NFT Marketplace (UI Demo)</h2>

        {listings.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#ccc" }}>
            Không có NFT nào đang được bán.
          </p>
        )}

        <div className="buy-list">
          {listings.map((item) => (
            <ListingCard
              key={`${item.nft}-${item.tokenId}`}
              nftAddress={item.nft}
              tokenId={item.tokenId}
              price={item.price.toString()}
              seller={item.seller}
              onBuy={() => buyNFT(item.nft, item.tokenId, item.price)}
              disabled={isBuying}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
