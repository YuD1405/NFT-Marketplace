import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Security - Reentrancy Attack", () => {
  let marketplace: any;
  let nftContract: any;
  let reentrantBuyer: any;
  let seller: HardhatEthersSigner;
  let attacker: HardhatEthersSigner;

  beforeEach(async () => {
    [seller, attacker] = await ethers.getSigners();

    // Deploy NFT
    const NFT = await ethers.getContractFactory("NFT");
    nftContract = await NFT.connect(seller).deploy("ipfs://fake/");
    await nftContract.waitForDeployment();

    // Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();

    // Seller mint và approve NFT
    await nftContract.connect(seller).mint(); // tokenId = 0
    await nftContract.connect(seller).approve(marketplace.target, 0);

    // Seller list NFT
    const price = ethers.parseEther("1");
    await marketplace.connect(seller).listNFT(nftContract.target, 0, price);

    // Deploy ReentrantBuyer (attacker contract)
    const ReentrantBuyer = await ethers.getContractFactory("ReentrantBuyer");
    reentrantBuyer = await ReentrantBuyer.connect(attacker).deploy(
      marketplace.target,
      nftContract.target,
      0
    );
    await reentrantBuyer.waitForDeployment();
  });

  it("should prevent reentrancy attack via ReentrantBuyer", async () => {
    const price = ethers.parseEther("1");

    // Gửi ETH từ attacker → gọi attack() từ ReentrantBuyer
     await expect(
      reentrantBuyer.connect(attacker).attack({ value: price })
    ).to.be.reverted;
  });
});
