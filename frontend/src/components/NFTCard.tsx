// src/components/NFTCard.tsx

import React from "react";
import "./NFTCard.css";

interface NFTCardProps {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  element: string; // giá trị element: "Fire", "Water", ...
}

export function NFTCard({ tokenId, name, description, imageUrl, element }: NFTCardProps) {
  // Chuyển element thành chuỗi class (lowercase) để khớp CSS, ví dụ "Fire" → "fire"
  const el = element.toLowerCase();
  console.log(el);
  return (
    <div className={`nftcard-container nftcard-${el}`}>
      {/* Tiêu đề NFT */}
      <h3 className="nftcard-title">{name}</h3>

      {/* Hình ảnh NFT */}
      <div className="nftcard-image-wrapper">
        <img src={imageUrl} alt={name} className="nftcard-image" />
      </div>

      {/* Nút “MORE” */}
      <button className="nftcard-button">MORE</button>
    </div>
  );
}
