import React from "react";
import "./BuyingCard.css";

interface Props {
  image: string;
  name: string;
  element: string;
  rarity: string;
  price: string; // giá ETH dưới dạng chuỗi, ví dụ "0.5"
  seller: string;
  onBuy: () => void;
  disabled?: boolean;
}

export const BuyingCard: React.FC<Props> = ({
  image,
  name,
  element,
  rarity,
  price,
  seller,
  onBuy,
  disabled,
}) => {
  const getBackgroundByElement = (el: string): string => {
    switch (el.toLowerCase()) {
      case "fire":
        return "#b71c1c";
      case "water":
        return "#1565c0";
      case "earth":
        return "#4e342e";
      case "air":
        return "#37474f";
      case "light":
        return "#fbc02d";
      case "dark":
        return "#212121";
      default:
        return "#1e1e2e";
    }
  };

  return (
    <div
      className="buying-card pixel-card"
      style={{ backgroundColor: getBackgroundByElement(element) }}
    >
      <img src={image} alt={name} className="nft-image" />
      <h3 className="nft-name">{name}</h3>
      <p className="nft-element">Element: <strong>{element}</strong></p>
      <p className="nft-rarity">Rarity: <strong>{rarity}</strong></p>
      <p className="nft-price">Price: <strong>{price} ETH</strong></p>
      <p className="nft-seller">Seller: {seller.slice(0, 6)}...{seller.slice(-4)}</p>

      <button className="buy-button" onClick={onBuy} disabled={disabled}>
        {disabled ? "⏳ Processing..." : "🛒 Buy NFT"}
      </button>
    </div>
  );
};
