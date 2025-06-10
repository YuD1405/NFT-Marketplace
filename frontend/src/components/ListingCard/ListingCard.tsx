// src/components/NFTCard.tsx

import React from "react";
import "./ListingCard.css";
import { estimatePrice } from "../../utils/estimatePrice";

interface NFTCardProps {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  element: string;
  attributes: { trait_type: string; value: string }[];
}

export function ListingCard({ tokenId, name, description, imageUrl, element, attributes,}: NFTCardProps) {
  // Chuyển element thành chuỗi class (lowercase) để khớp CSS, ví dụ "Fire" → "fire"
  const el = element.toLowerCase();
  const price = estimatePrice(attributes); 

  return (
    <div className={`listingcard-container listingcard-${el}`}>
      {/* Tiêu đề NFT */}
      <h3 className="listingcard-title">{name}</h3>

      {/* Hình ảnh NFT */}
      <div className="listingcard-image-wrapper">
        <img src={imageUrl} alt={name} className="listingcard-image" />
      </div>

      {/* Giá dự đoán */}
      <div className="listingcard-price">Est. Price: {price} ETH</div>
      
    </div>
  );
}
