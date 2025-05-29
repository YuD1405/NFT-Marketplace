import { useState, useEffect } from "react";
import { getNFTContract } from "./useContracts";
import { useWallet } from "./useWallet";

interface NFTItem {
  tokenId: number;
  name: string;
  description: string;
  image: string;
}

export function useNFT() {
  const { provider, account } = useWallet();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyNFTs = async () => {
    if (!provider || !account) return;
    setLoading(true);

    try {
        const contract = getNFTContract(provider);
        const balance = await contract.balanceOf(account);
        const owned: NFTItem[] = [];

        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(account, i);
            const tokenURI = await contract.tokenURI(tokenId);
            const res = await fetch(tokenURI);
            const meta = await res.json();

            owned.push({
                tokenId: Number(tokenId),
                name: meta.name,
                description: meta.description,
                image: meta.image,
            });
        }
        setNfts(owned);
    } catch (err) {
        console.error("❌ Failed to fetch NFTs", err);
    } finally {
        setLoading(false);
    }
  };


  const mint = async () => {
    if (!provider || !account) return;
    const signer = await provider.getSigner();
    const contract = getNFTContract(signer);
    const tx = await contract.mint();
    await tx.wait();
    await fetchMyNFTs();
  };

  useEffect(() => {
    fetchMyNFTs();
  }, [account]);

  return { nfts, loading, mint, fetchMyNFTs };
}
