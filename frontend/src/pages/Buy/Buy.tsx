import React, { useState } from "react";
import { BuyingCard } from "../../components/BuyingCard/BuyingCard";
import "./Buy.css";

export default function Buy() {
    // Dữ liệu giả, mock listings để hiển thị giao diện
    const [listings] = useState([
    {
      nft: "0xAbc123...def",
      tokenId: 1,
      price: BigInt("1000000000000000000"),
      seller: "0xSellerAddress123",
      name: "Flame Sword",
      image: "https://example.com/images/flame_sword.png",
      element: "Fire",
      rarity: "Epic",
    },
    {
      nft: "0xDef456...abc",
      tokenId: 2,
      price: BigInt("500000000000000000"),
      seller: "0xAnotherSeller456",
      name: "Ice Shield",
      image: "https://example.com/images/ice_shield.png",
      element: "Water",
      rarity: "Rare",
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
        <h2 className="buy-title">NFT Marketplace</h2>

        {listings.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#ccc" }}>
            Không có NFT nào đang được bán.
          </p>
        )}

        <div className="buy-list">
          {listings.map((item) => (
            <BuyingCard
              key={`${item.nft}-${item.tokenId}`}
              image={item.image}
              name={item.name}
              element={item.element}
              rarity={item.rarity}
              price={(Number(item.price) / 1e18).toString()}
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
