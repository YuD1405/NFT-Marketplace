// src/hooks/useNFT.ts

import { useState, useEffect, useCallback } from "react";
import { getNFTContract } from "./useContracts";
import { useWallet } from "./useWallet";
import { ipfsToHttps } from "../utils/ipfsToUrl";
import { showToast } from "../components/Toast/ToastContainer";
import { extractErrorMessage } from "../components/Toast/ToastUtils";
import { ethers } from "ethers";

interface NFTItem {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  element: string;
  weaponType: string;
  rarity: string;
  skill: string;
  attributes: { trait_type: string; value: string }[];
}

export function useNFT(account: string | null, provider: ethers.BrowserProvider | null){
  //const { provider, account } = useWallet();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyNFTs = useCallback(async () => {
    if (!provider || !account) {
      setNfts([]);
      return;
    }
    setLoading(true);

    try {
      const contract = getNFTContract(provider);
      const balanceBig: bigint = await contract.balanceOf(account);
      const balance = Number(balanceBig);
      const owned: NFTItem[] = [];

      for (let i = 0; i < balance; i++) {
        const tokenIdBig: bigint = await contract.tokenOfOwnerByIndex(account, i);
        const tokenId = Number(tokenIdBig);

        let tokenURI: string = await contract.tokenURI(tokenId);
        tokenURI = ipfsToHttps(tokenURI);

        const res = await fetch(tokenURI);
        const meta = await res.json();

        // Lấy trường element từ JSON metadata
        const element = meta.attributes[0].value || "Unknown";
        const weaponType = meta.attributes[1].value || "Unknown";
        const rarity = meta.attributes[2].value || "Unknown";
        const skill = meta.attributes[3].value || "Unknown";
        const attributes = meta.attributes;
        const imageUrl = meta.image ? ipfsToHttps(meta.image) : "";

        owned.push({
          tokenId,
          name: meta.name,
          description: meta.description,
          image: imageUrl,
          element,
          weaponType,
          rarity,
          skill,
          attributes,
        });
      }
      setNfts(owned);
    } catch (err) {
      const msg = "Failed to fetch NFTs: " + extractErrorMessage(err);
      showToast(msg, "error");
      console.error("❌ Failed to fetch NFTs", err);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, [provider, account]);

  const mint = useCallback(async () => {
    if (!provider || !account) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = getNFTContract(signer);
      const tx = await contract.mint();
      await tx.wait();
      await fetchMyNFTs();
      console.log("Minted");
      showToast("Minted", "success");
    } catch (err) {
      console.log("Failed to mint NFTs: " + extractErrorMessage(err));
      const msg = "Failed to mint NFTs: " + extractErrorMessage(err);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [provider, account, fetchMyNFTs]);

  useEffect(() => {
    if (account) {
      fetchMyNFTs();
    } else {
      setNfts([]);
    }
  }, [account, fetchMyNFTs]);

  return { nfts, loading, mint, fetchMyNFTs };
}
