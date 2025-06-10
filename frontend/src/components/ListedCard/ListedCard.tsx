// src/components/ListedCard/ListedCard.tsx
import React from "react";
import "./ListedCard.css";

interface Attribute {
  trait_type: string;
  value: string;
}

interface Props {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  element: string;
  price: bigint;
  seller: string;
  attributes: Attribute[];
}

export const ListedCard = ({
  tokenId,
  name,
  description,
  imageUrl,
  element,
  price,
  seller,
  attributes,
}: Props) => {
  return (
    <div className="listed-card">
      <img src={imageUrl} alt={name} className="listed-card-image" />
      <div className="listed-card-content">
        <h3>{name}</h3>
        <p><strong>Token ID:</strong> #{tokenId}</p>
        <p><strong>Element:</strong> {element}</p>
        <p><strong>Price:</strong> {(Number(price) / 1e18).toFixed(3)} ETH</p>
        <p><strong>Seller:</strong> {seller.slice(0, 6)}...{seller.slice(-4)}</p>
        <p className="listed-card-description">{description}</p>
      </div>
    </div>
  );
};
