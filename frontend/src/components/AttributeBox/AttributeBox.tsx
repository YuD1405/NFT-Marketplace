import React from "react";
import "./AttributeBox.css";

interface AttributeBoxProps {
  label: string; // Ví dụ: "Element", "Rarity", "Weapon Type"
  value: string; // Ví dụ: "Fire", "Rare", "Melee"
}

export const AttributeBox: React.FC<AttributeBoxProps> = ({ label, value }) => {
  const key = value.toLowerCase().replace(/\s+/g, ""); // "Fire" -> "fire", "Weapon Type" -> "weapontype"

  // Gắn ảnh nền tương ứng theo value
  const imageUrl = `https://yud1405.github.io/NFT_marketplace_Img/${key}.png`;

  return (
    <div className="attribute-box">
      <div
        className="attribute-content"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    </div>
  );
};
