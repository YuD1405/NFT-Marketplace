import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { getMarketplaceContract, getNFTContract } from "./useContracts";
import { ipfsToHttps } from "../utils/ipfsToUrl";
import type { JsonRpcSigner, BrowserProvider } from "ethers";

interface NFTItem {
  nft: string;
  tokenId: number;
  price: bigint;
  seller: string;
  name: string;
  description: string;
  image: string;
  element: string;
}

interface UseMarketplaceReturn {
  listings: NFTItem[];
  isFetching: boolean;
  isBuying: boolean;
  fetchAllListings: () => Promise<void>;
  buyNFT: (nftAddress: string, tokenId: number, price: bigint) => Promise<void>;
}

export function useMarketplace(
  signer: JsonRpcSigner | null,
  provider: BrowserProvider | null
): UseMarketplaceReturn {
  const [listings, setListings] = useState<NFTItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const marketRead = provider ? getMarketplaceContract(provider) : null;
  const marketWrite = signer ? getMarketplaceContract(signer) : null;

  const fetchAllListings = useCallback(async () => {
    if (!marketRead || !provider) {
      setListings([]);
      return;
    }

    setIsFetching(true);
    try {
      const listingIds: { nft: string; tokenId: bigint }[] = await marketRead.getAllListings();
      const result: NFTItem[] = [];

      for (const { nft, tokenId } of listingIds) {
        const tokenIdNum = Number(tokenId);
        const listing = await marketRead.getListing(nft, tokenIdNum);
        const nftContract = getNFTContract(provider); // chính xác address từ từng listing

        let tokenURI: string = await nftContract.tokenURI(tokenIdNum);
        tokenURI = ipfsToHttps(tokenURI);

        const res = await fetch(tokenURI);
        const meta = await res.json();

        const attrs = meta.attributes || [];
        const getAttr = (key: string) =>
          attrs.find((a: any) => a.trait_type === key)?.value || "Unknown";
        
        result.push({
          nft,
          tokenId: tokenIdNum,
          price: listing.price as bigint,
          seller: listing.seller as string,
          name: meta.name || `#${tokenIdNum}`,
          description: meta.description || "",
          image: meta.image ? ipfsToHttps(meta.image) : "",
          element: getAttr("Element"),
        });
      }

      setListings(result);
    } catch (err) {
      console.error("❌ Error fetchAllListings:", err);
      setListings([]);
    } finally {
      setIsFetching(false);
    }
  }, [marketRead, provider]);

  const buyNFT = useCallback(
    async (nftAddress: string, tokenId: number, price: bigint) => {
      if (!marketWrite) {
        alert("Contract Marketplace chưa sẵn sàng");
        return;
      }
      setIsBuying(true);
      try {
        const tx = await marketWrite.buyNFT(nftAddress, tokenId, { value: price });
        await tx.wait();
        await fetchAllListings();
        alert("✅ Mua NFT thành công!");
      } catch (err) {
        console.error("❌ Error buyNFT:", err);
        alert("❌ Mua thất bại. Kiểm tra console.");
      } finally {
        setIsBuying(false);
      }
    },
    [marketWrite, fetchAllListings]
  );

  const hasFetched = useRef(false);

  useEffect(() => {
    if (provider && !hasFetched.current) {
      fetchAllListings();
      hasFetched.current = true;
    }
  }, [provider]);

  return { listings, isFetching, isBuying, fetchAllListings, buyNFT };
}
