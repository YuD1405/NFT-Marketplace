import React from "react";
import "./BuyingCard.css";

interface BuyingCardProps {
  name: string;
  image: string;
  element: string;
  rarity: string;
  price: string;
  seller: string;
  disabled?: boolean;
  onBuy: () => void;
}

export function BuyingCard({
  name,
  image,
  element,
  rarity,
  price,
  seller,
  onBuy,
  disabled,
}: BuyingCardProps) {
  const el = element.toLowerCase();
  
  return (
    <div className={`nftcard-container nftcard-${el}`}>
      <h3 className="nftcard-title">{name}</h3>
      <div className="nftcard-image-wrapper">
        <img src={image} alt={name} className="nftcard-image" />
      </div>
      <button className="nftcard-button" onClick={onBuy} disabled={disabled}>
        {disabled ? "Processing..." : "Buy"}
      </button>
    </div>
  );
}
