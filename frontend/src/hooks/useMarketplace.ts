import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { getMarketplaceContract } from "./useContracts";
import type { JsonRpcSigner, BrowserProvider } from "ethers";

interface ListingItem {
  nft: string;
  tokenId: number;
  price: bigint;  // dùng bigint thay vì BigNumber
  seller: string;
}

interface UseMarketplaceReturn {
  listings: ListingItem[];
  isFetching: boolean;
  isBuying: boolean;
  fetchAllListings: () => Promise<void>;
  buyNFT: (nftAddress: string, tokenId: number, price: bigint) => Promise<void>;
}

export function useMarketplace(
  signer: JsonRpcSigner | null,
  provider: BrowserProvider | null
): UseMarketplaceReturn {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const marketRead = provider ? getMarketplaceContract(provider) : null;
  const marketWrite = signer ? getMarketplaceContract(signer) : null;

  const fetchAllListings = useCallback(async () => {
    if (!marketRead) {
      setListings([]);
      return;
    }
    setIsFetching(true);
    try {
      const listingIds: { nft: string; tokenId: bigint }[] =
        await marketRead.getAllListings();

      const arr: ListingItem[] = [];
      for (const x of listingIds) {
        const nftAddr = x.nft;
        const tokenIdNum = Number(x.tokenId);
        const listing = await marketRead.getListing(nftAddr, tokenIdNum);
        arr.push({
          nft: nftAddr,
          tokenId: tokenIdNum,
          price: listing.price as bigint,
          seller: listing.seller as string,
        });
      }
      setListings(arr);
    } catch (err) {
      console.error("Error fetchAllListings:", err);
      setListings([]);
    } finally {
      setIsFetching(false);
    }
  }, [marketRead]);

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
        alert("Mua NFT thành công!");
      } catch (err) {
        console.error("Error buyNFT:", err);
        alert("Mua thất bại, vui lòng kiểm tra console.");
      } finally {
        setIsBuying(false);
      }
    },
    [marketWrite, fetchAllListings]
  );

  useEffect(() => {
    if (marketRead) {
      fetchAllListings();
    }
  }, [marketRead, fetchAllListings]);

  return { listings, isFetching, isBuying, fetchAllListings, buyNFT };
}
