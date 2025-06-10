type Attribute = { trait_type: string; value: string };
type NFT = { name: string; attributes: Attribute[] };

export function estimatePrice(attributes: { trait_type: string; value: string }[]): number {
  let basePrice = 0.01; // Base price in ETH

  for (const attr of attributes) {
    if (attr.trait_type === "Rarity") {
      switch (attr.value) {
        case "Legendary": basePrice += 0.5; break;
        case "Epic": basePrice += 0.2; break;
        case "Rare": basePrice += 0.1; break;
        case "Normal": basePrice += 0.05; break;
      }
    }

    if (attr.trait_type === "Element") {
      if (["Light", "Dark", "Thunder"].includes(attr.value)) {
        basePrice += 0.1;
      }
    }

    if (attr.trait_type === "Weapon Type") {
      if (["Magic", "Range"].includes(attr.value)) {
        basePrice += 0.05;
      }
    }
  }

  return parseFloat(basePrice.toFixed(3));
}

