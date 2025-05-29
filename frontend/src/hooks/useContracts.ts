import { ethers } from "ethers";
import NFTABI from "../abi/NFT.json";
import MARKETABI from "../abi/Marketplace.json";
import { NFT_ADDRESS, MARKETPLACE_ADDRESS } from "../config";

export const getNFTContract = (signerOrProvider: any) =>
  new ethers.Contract(NFT_ADDRESS, NFTABI.abi, signerOrProvider);

export const getMarketplaceContract = (signerOrProvider: any) =>
  new ethers.Contract(MARKETPLACE_ADDRESS, MARKETABI.abi, signerOrProvider);
