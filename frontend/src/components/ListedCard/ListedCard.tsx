// src/components/ListedCard.tsx

import React from "react";
import "./ListedCard.css";

interface ListedCardProps {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  element: string;
  attributes: { trait_type: string; value: string }[];
  price?: string; 
  seller: string;
}

export function ListedCard({
  tokenId,
  name,
  description,
  imageUrl,
  element,
  attributes,
  price,
  seller,
}: ListedCardProps) {
  const el = element.toLowerCase();
  const displayPrice = price;

  return (
    <div className={`listedcard-container listedcard-${el}`}>
      <h3 className="listedcard-title">{name}</h3>

      <div className="listedcard-image-wrapper">
        <img src={imageUrl} alt={name} className="listedcard-image" />
      </div>

      <div className="listedcard-price">
        {price ? `Price: ${displayPrice} ETH` : `Est. Price: ${displayPrice} ETH`}
      </div>
    </div>
  );
}
