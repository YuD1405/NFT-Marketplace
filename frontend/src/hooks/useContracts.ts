import { ethers } from "ethers";
import { NFT_ADDRESS, MARKETPLACE_ADDRESS, NFT_ABI_JSON, MARKETPLACE_ABI_JSON } from "../config";

export const getNFTContract = (signerOrProvider: any) =>
  new ethers.Contract(NFT_ADDRESS, NFT_ABI_JSON, signerOrProvider);

export const getMarketplaceContract = (signerOrProvider: any) =>
  new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI_JSON, signerOrProvider);
