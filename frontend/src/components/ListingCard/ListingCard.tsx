import React from "react";
import "./ListingCard.css";

interface Props {
  nftAddress: string;
  tokenId: number;
  price: string; // display as string
  seller: string;
  onBuy: () => void;
  disabled?: boolean;
}

export const ListingCard: React.FC<Props> = ({
  nftAddress,
  tokenId,
  price,
  seller,
  onBuy,
  disabled,
}) => {
  return (
    <div className="listing-card">
      <p><strong>NFT:</strong> {nftAddress}</p>
      <p><strong>Token ID:</strong> {tokenId}</p>
      <p><strong>Giá:</strong> {Number(price) / 1e18} ETH</p>
      <p><strong>Người bán:</strong> {seller}</p>
      <button onClick={onBuy} disabled={disabled}>
        {disabled ? "Đang xử lý..." : "Mua NFT"}
      </button>
    </div>
  );
};
