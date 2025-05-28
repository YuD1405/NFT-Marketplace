import { ethers } from "hardhat";
import { ethers as originalEthers } from "ethers";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Marketplace", () => {
  let marketplace: any;
  let nftContract: any;
  let admin: HardhatEthersSigner;
  let seller: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;
  let user_1: HardhatEthersSigner;

  beforeEach(async () => {
    [admin, seller, buyer, user_1] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFT");
    nftContract = await NFT.deploy("ipfs://QmdVPx2qrVD6vuaePN5CtL61WArTettLeKPUoGcsCYb6ur/");
    await nftContract.waitForDeployment();    

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();  
  });

  describe("Deployment", () => {
    it("should set the correct owner (admin)", async () => {
      const adminFromContract = await marketplace.admin();
      const ownerAddress = await admin.getAddress();
      expect(adminFromContract).to.equal(ownerAddress);
    });

    it("should initialize platformFee to 250 basis points", async () => {
      const platformFee = await marketplace.platformFeeBasisPoints();
      expect(platformFee).to.equal(250);
    });

    it("should initialize totalVolumeTraded and totalListings to 0", async () => {
      const totalVolume = await marketplace.totalVolumeTraded();
      const totalList = await marketplace.totalListings();
      expect(totalVolume).to.equal(0);
      expect(totalList).to.equal(0);
    });
  });

  describe("Listing NFT", () => {
    context("when listing a valid NFT", () => {
      it("should allow owner to list NFT successfully", async () => {
        // 1. Mint NFT với seller
        await nftContract.connect(seller).mint(); // mint tokenId = 0

        // 2. Approve Marketplace
        await nftContract.connect(seller).approve(marketplace.target, 0);

        // 3. Gọi listNFT từ marketplace
        const price = originalEthers.parseEther("1"); // giá list
        await expect(
          marketplace.connect(seller).listNFT(nftContract.target, 0, price)
        ).to.emit(marketplace, "NFTListed");

        // 4. Kiểm tra dữ liệu đã list
        const listing = await marketplace.getListing(nftContract.target, 0);
        expect(listing.seller).to.equal(await seller.getAddress());
        expect(listing.price).to.equal(price);
      });

      it("should emit NFTListed and ListingsCountUpdated", async () => {
        // 1. Mint NFT với seller
        await nftContract.connect(seller).mint(); // mint tokenId = 0

        // 2. Approve Marketplace
        await nftContract.connect(seller).approve(marketplace.target, 0);

        // 3. Gọi listNFT từ marketplace
        const price = originalEthers.parseEther("1"); // giá list

        await expect(
          marketplace.connect(seller).listNFT(nftContract.target, 0, price)
        )
          .to.emit(marketplace, "NFTListed")
          .withArgs(await seller.getAddress(), nftContract.target, 0, price) // kiểm tra thông tin NFTListed
          .and.to.emit(marketplace, "ListingsCountUpdated")
          .withArgs(1);

        // 4. Đảm bảo biến state cập nhật chính xác
        const listingCount = await marketplace.totalListings();
        expect(listingCount).to.equal(1);
      });
    });

    context("when listing fails", () => {
      it("should revert if not the NFT owner", async () => {
        // 1. Mint NFT với seller
        await nftContract.connect(seller).mint(); // mint tokenId = 0

        // 2. Approve Marketplace
        await nftContract.connect(seller).approve(marketplace.target, 0);

        // 3. Gọi listNFT từ marketplace
        const price = originalEthers.parseEther("1"); // giá list
        await expect(
          marketplace.connect(user_1).listNFT(nftContract.target, 0, price)
        ).to.be.revertedWith("Not the owner of NFT");
      });

      it("should revert if price is zero", async () => {
        // 1. Mint NFT với seller
        await nftContract.connect(seller).mint(); // mint tokenId = 0

        // 2. Approve Marketplace
        await nftContract.connect(seller).approve(marketplace.target, 0);

        // 3. Gọi listNFT từ marketplace
        const price = originalEthers.parseEther("0"); // giá list
        await expect(
          marketplace.connect(seller).listNFT(nftContract.target, 0, price)
        ).to.be.revertedWith("Price must be greater than 0");
      });

      it("should revert if marketplace is not approved", async () => {
        // 1. Mint NFT với seller
        await nftContract.connect(seller).mint(); // mint tokenId = 0

        // 2. Gọi listNFT từ marketplace
        const price = originalEthers.parseEther("1"); // giá list
        await expect(
          marketplace.connect(seller).listNFT(nftContract.target, 0, price)
        ).to.be.revertedWith("Marketplace not approved");
      });

      it("should revert if NFT is already listed", async () => {
        // 1. Mint NFT với seller
        await nftContract.connect(seller).mint(); // mint tokenId = 0

        // 2. Approve Marketplace
        await nftContract.connect(seller).approve(marketplace.target, 0);

        // 3. Gọi listNFT từ marketplace
        const price = originalEthers.parseEther("1"); // giá list

        await marketplace.connect(seller).listNFT(nftContract.target, 0, price);
        await expect(
          marketplace.connect(seller).listNFT(nftContract.target, 0, price)
        ).to.be.revertedWith("Already listed");
      });

    });

    context("when listing multiple NFTs", () => {
      it("should allow user to list multiple NFTs with correct state tracking", async () => {
        // Seller mint và approve nhiều NFT
        const tokenIds = [0, 1, 2];
        const prices = [
          originalEthers.parseEther("1"),
          originalEthers.parseEther("2"),
          originalEthers.parseEther("3"),
        ];

        for (let i = 0; i < tokenIds.length; i++) {
          await nftContract.connect(seller).mint();
          await nftContract.connect(seller).approve(marketplace.target, tokenIds[i]);

          await expect(
            marketplace.connect(seller).listNFT(nftContract.target, tokenIds[i], prices[i])
          )
            .to.emit(marketplace, "NFTListed")
            .withArgs(await seller.getAddress(), nftContract.target, tokenIds[i], prices[i]);
        }

        // Kiểm tra từng listing đúng
        for (let i = 0; i < tokenIds.length; i++) {
          const listing = await marketplace.getListing(nftContract.target, tokenIds[i]);
          expect(listing.seller).to.equal(await seller.getAddress());
          expect(listing.price).to.equal(prices[i]);
        }

        // Kiểm tra tổng số listing cập nhật đúng
        const total = await marketplace.totalListings();
        expect(total).to.equal(tokenIds.length);
      });

      it("should allow listing same tokenId from different NFT contracts", async () => {
        // Deploy NFT thứ hai
        const NFT = await ethers.getContractFactory("NFT");
        const nft2 = await NFT.connect(admin).deploy("ipfs://QmdVPx2qrVD6vuaePN5CtL61WArTettLeKPUoGcsCYb6ur/");
        await nft2.waitForDeployment();  

        // Mint tokenId 0 ở cả 2 contract
        await nftContract.connect(seller).mint(); // tokenId 0
        await nft2.connect(seller).mint(); // tokenId 0

        await nftContract.connect(seller).approve(marketplace.target, 0);
        await nft2.connect(seller).approve(marketplace.target, 0);

        const price = originalEthers.parseEther("1");

        await marketplace.connect(seller).listNFT(nftContract.target, 0, price);
        await marketplace.connect(seller).listNFT(nft2.target, 0, price);

        const listing1 = await marketplace.getListing(nftContract.target, 0);
        const listing2 = await marketplace.getListing(nft2.target, 0);

        expect(listing1.seller).to.equal(await seller.getAddress());
        expect(listing2.seller).to.equal(await seller.getAddress());
      });

      it("should correctly update totalListings when multiple tokens are listed", async () => {
        for (let i = 0; i < 5; i++) {
          await nftContract.connect(seller).mint();
          await nftContract.connect(seller).approve(marketplace.target, i);
          await marketplace.connect(seller).listNFT(nftContract.target, i, originalEthers.parseEther("1"));
        }

        const totalListings = await marketplace.totalListings();
        expect(totalListings).to.equal(5);
      });

      it("should allow multiple users to list their own NFTs", async () => {
        await nftContract.connect(seller).mint(); // tokenId 0
        await nftContract.connect(user_1).mint(); // tokenId 1

        await nftContract.connect(seller).approve(marketplace.target, 0);
        await nftContract.connect(user_1).approve(marketplace.target, 1);

        await marketplace.connect(seller).listNFT(nftContract.target, 0, originalEthers.parseEther("1"));
        await marketplace.connect(user_1).listNFT(nftContract.target, 1, originalEthers.parseEther("2"));

        const listing0 = await marketplace.getListing(nftContract.target, 0);
        const listing1 = await marketplace.getListing(nftContract.target, 1);

        expect(listing0.seller).to.equal(await seller.getAddress());
        expect(listing1.seller).to.equal(await user_1.getAddress());
      });
    });
  });

  describe("Buying NFT", () => {
    context("when buying a listed NFT", () => {
      beforeEach(async () => {
        // 1. Seller mint NFT
        await nftContract.connect(seller).mint(); // tokenId = 0

        // 2. Seller approve marketplace
        await nftContract.connect(seller).approve(marketplace.target, 0);

        // 3. Seller list NFT
        const price = originalEthers.parseEther("1");
        await marketplace.connect(seller).listNFT(nftContract.target, 0, price);
      });

      it("should transfer NFT to buyer", async () => {
        await marketplace.connect(buyer).buyNFT(nftContract.target, 0, {
          value: originalEthers.parseEther("1"),
        });

        const newOwner = await nftContract.ownerOf(0);
        expect(newOwner).to.equal(await buyer.getAddress());
      });

      it("should transfer ETH to seller (after fee)", async () => {
        const sellerAddress = await seller.getAddress();
        const initialBalance = await ethers.provider.getBalance(sellerAddress);

        const tx = await marketplace.connect(buyer).buyNFT(nftContract.target, 0, {
          value: originalEthers.parseEther("1"),
        });

        const finalBalance = await ethers.provider.getBalance(sellerAddress);
        const fee = originalEthers.parseEther("1") * BigInt(250) / BigInt(10000);
        const expected = originalEthers.parseEther("1") - fee;

        expect(finalBalance - initialBalance).to.equal(expected);
      });

      it("should increase totalVolumeTraded", async () => {
        await marketplace.connect(buyer).buyNFT(nftContract.target, 0, {
          value: originalEthers.parseEther("1"),
        });

        const volume = await marketplace.totalVolumeTraded();
        expect(volume).to.equal(originalEthers.parseEther("1"));
      });

      it("should emit NFTSold and VolumeUpdated", async () => {
        await expect(
          marketplace.connect(buyer).buyNFT(nftContract.target, 0, {
            value: originalEthers.parseEther("1"),
          })
        )
          .to.emit(marketplace, "NFTSold")
          .withArgs(await seller.getAddress(), await buyer.getAddress(), nftContract.target, 0, originalEthers.parseEther("1"))
          .and.to.emit(marketplace, "VolumeUpdated")
          .withArgs(originalEthers.parseEther("1"));
      });

      it("should remove NFT from listings and listingsList", async () => {
        await marketplace.connect(buyer).buyNFT(nftContract.target, 0, {
          value: originalEthers.parseEther("1"),
        });

        const listing = await marketplace.getListing(nftContract.target, 0);
        expect(listing.seller).to.equal(ethers.ZeroAddress); // Đã xóa

        const listingsList = await marketplace.getAllListings();
        expect(listingsList).to.not.include(0);
      });
    });

    context("when buying fails", () => {
      beforeEach(async () => {
        // 1. Seller mint NFT
        await nftContract.connect(seller).mint(); // tokenId = 0

        // 2. Seller approve marketplace
        await nftContract.connect(seller).approve(marketplace.target, 0);
      });

      it("should revert if NFT is not listed", async () => {
        await expect(marketplace.connect(buyer).buyNFT(nftContract.target, 0, {
          value: originalEthers.parseEther("1"),
        })).to.be.revertedWith("Not listed");
      });

      it("should revert if value sent is incorrect", async () => {
        marketplace.connect(seller).listNFT(nftContract.target, 0, originalEthers.parseEther("2"));

        await expect (marketplace.connect(buyer).buyNFT(nftContract.target, 0, {
          value: originalEthers.parseEther("1"),
        })).to.be.revertedWith("Incorrect price");
      });
    });
  });

  describe("Canceling listing", () => {
    beforeEach(async () => {
      // 1. Seller mint NFT
      await nftContract.connect(seller).mint(); // tokenId = 0

      // 2. Seller approve marketplace
      await nftContract.connect(seller).approve(marketplace.target, 0);

      // 3. Seller list NFT
      const price = originalEthers.parseEther("1");
      await marketplace.connect(seller).listNFT(nftContract.target, 0, price);
    });

    it("should allow seller to cancel listing", async () => {
      await expect(
        marketplace.connect(seller).cancelListing(nftContract.target, 0)
      ).not.to.be.reverted;
    });

    it("should remove listing from mapping and listingsList", async () => {
      await marketplace.connect(seller).cancelListing(nftContract.target, 0);

      const listing = await marketplace.getListing(nftContract.target, 0);
      expect(listing.price).to.equal(0);
      expect(listing.seller).to.equal(ethers.ZeroAddress);

      const list = await marketplace.getAllListings(); // nếu có hàm hỗ trợ
      expect(list).to.not.deep.include([
        nftContract.target,
        0,
        await seller.getAddress(),
        originalEthers.parseEther("1"),
      ]);
    });

    it("should emit ListingCanceled", async () => {
      await expect(
        marketplace.connect(seller).cancelListing(nftContract.target, 0)
      ).to.emit(marketplace, "ListingCanceled")
      .withArgs(await seller.getAddress(), nftContract.target, 0);
    });

    it("should revert if caller is not the seller", async () => {
      await expect(
        marketplace.connect(user_1).cancelListing(nftContract.target, 0)
      ).to.be.revertedWith("Caller is not seller");
    });

    it("should revert if NFT is not listed", async () => {
      await nftContract.connect(seller).mint(); // token id = 1

      await expect(
        marketplace.connect(seller).cancelListing(nftContract.target, 1)
      ).to.be.revertedWith("Listing does not exist");
    });
  });

  describe("Updating listing price", () => {
    beforeEach(async () => {
      // 1. Seller mint NFT
      await nftContract.connect(seller).mint(); // tokenId = 0

      // 2. Seller approve marketplace
      await nftContract.connect(seller).approve(marketplace.target, 0);

      // 3. Seller list NFT
      const price = originalEthers.parseEther("1");
      await marketplace.connect(seller).listNFT(nftContract.target, 0, price);
    });
    
    it("should allow seller to update price", async () => {
      await expect(
        marketplace.connect(seller).updateListing(nftContract.target, 0, originalEthers.parseEther("2"))
      ).not.to.be.reverted;
    });

    it("should emit ListingUpdated with new price", async () => {
      const newPrice = originalEthers.parseEther("2");
      await expect(
        marketplace.connect(seller).updateListing(nftContract.target, 0, newPrice)
      ).to.emit(marketplace, "ListingUpdated")
      .withArgs(await seller.getAddress(), nftContract.target, 0, newPrice);
    });

    it("should revert if new price is zero", async () => {
      const newPrice = originalEthers.parseEther("0");
      await expect(
        marketplace.connect(seller).updateListing(nftContract.target, 0, newPrice)
      ).to.be.revertedWith("Invalid price");
    });

    it("should revert if caller is not the seller", async () => {
      const newPrice = originalEthers.parseEther("1");
      await expect(
        marketplace.connect(user_1).updateListing(nftContract.target, 0, newPrice)
      ).to.be.revertedWith("Caller is not seller");
    });

    it("should revert if NFT is not listed", async () => {
      await nftContract.connect(seller).mint(); // token id = 1
      const newPrice = originalEthers.parseEther("1");

      await expect(
        marketplace.connect(seller).updateListing(nftContract.target, 1, newPrice)
      ).to.be.revertedWith("Listing does not exist");
    });
  });

  describe("Withdraw function", () => {
    const price = originalEthers.parseEther("1");
    beforeEach(async () => {
      // 1. Seller mint NFT
      await nftContract.connect(seller).mint(); // tokenId = 0

      // 2. Seller approve marketplace
      await nftContract.connect(seller).approve(marketplace.target, 0);

      // 3. Seller list NFT
      await marketplace.connect(seller).listNFT(nftContract.target, 0, price);

      // 4. buyer buy NFT
      await marketplace.connect(buyer).buyNFT(nftContract.target, 0, {
        value: price,
      });
    });

    it("should allow admin to withdraw balance (total fee) to given address", async () => {
      const fee = price * BigInt(250) / BigInt(10000);

      const contractBalance = await ethers.provider.getBalance(marketplace.target);
      expect(contractBalance).to.equal(fee);

      const adminAddress = await admin.getAddress();
      const before = await ethers.provider.getBalance(adminAddress);

      await marketplace.connect(admin).withdrawTo(adminAddress);
      const after = await ethers.provider.getBalance(adminAddress);

      // Do gas không bị trừ từ adminAddress (vì gas từ contract), so sánh đơn giản
      expect(after).to.be.gte(before);
    });

    it("should revert if non-admin calls", async () => {
      await expect(
        marketplace.connect(buyer).withdrawTo(await buyer.getAddress())
      ).to.be.revertedWith("Not admin");
    });

    it("should revert if to-address is zero", async () => {
      await expect(
        marketplace.connect(admin).withdrawTo(originalEthers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });
  });

  describe("Getters", () => {
    it("getListing() should return correct seller and price", async () => {
      await nftContract.connect(seller).mint();
      const price = originalEthers.parseEther("1");
      await nftContract.connect(seller).approve(marketplace.target, 0);
      await marketplace.connect(seller).listNFT(nftContract.target, 0, price);

      const listing = await marketplace.getListing(nftContract.target, 0);
      expect(listing.seller).to.equal(await seller.getAddress());
      expect(listing.price).to.equal(price);
    });

    it("getAllListings() should return all currently listed NFTs", async () => {
      await nftContract.connect(seller).mint();
      await nftContract.connect(seller).approve(marketplace.target, 0);
      const price = originalEthers.parseEther("1");
      await marketplace.connect(seller).listNFT(nftContract.target, 0, price);

      const listings = await marketplace.getAllListings();
      expect(listings.length).to.equal(1);
      expect(listings[0].tokenId).to.equal(0);
    });
  });

  describe("Internal logic - _removeListingFromList", () => {
    it("should remove listing correctly from listingsList", async () => {
      await nftContract.connect(seller).mint();
      await nftContract.connect(seller).approve(marketplace.target, 0);
      const price = originalEthers.parseEther("1");
      await marketplace.connect(seller).listNFT(nftContract.target, 0, price);

      await marketplace.connect(seller).cancelListing(nftContract.target, 0);

      const listings = await marketplace.getAllListings();
      expect(listings.length).to.equal(0);
    });

    it("should not break array structure", async () => {
      for (let i = 0; i < 3; i++) {
        await nftContract.connect(seller).mint();
        await nftContract.connect(seller).approve(marketplace.target, i);
        const price = originalEthers.parseEther("1");
        await marketplace.connect(seller).listNFT(nftContract.target, i, price);
      }

      await marketplace.connect(seller).cancelListing(nftContract.target, 1);
      const listings = await marketplace.getAllListings();
      const tokenIds = listings.map((l: any) => l.tokenId.toString());
      expect(tokenIds).to.include("0");
      expect(tokenIds).to.include("2");
      expect(tokenIds).to.not.include("1");
    });

    it("should handle edge case: last element being removed", async () => {
      await nftContract.connect(seller).mint();
      await nftContract.connect(seller).approve(marketplace.target, 0);
      const price = originalEthers.parseEther("1");
      await marketplace.connect(seller).listNFT(nftContract.target, 0, price);
      await marketplace.connect(seller).cancelListing(nftContract.target, 0);

      const listings = await marketplace.getAllListings();
      expect(listings.length).to.equal(0);
    });
  });

  describe("Security & Modifiers", () => {
    it("onlyAdmin should restrict access to admin-only functions", async () => {
      await expect(
        marketplace.connect(user_1).withdrawTo(await user_1.getAddress())
      ).to.be.revertedWith("Not admin");
    });

    it("onlySeller should restrict access to listing management", async () => {
      await nftContract.connect(seller).mint();
      await nftContract.connect(seller).approve(marketplace.target, 0);
      const price = originalEthers.parseEther("1");
      await marketplace.connect(seller).listNFT(nftContract.target, 0, price);

      await expect(
        marketplace.connect(user_1).cancelListing(nftContract.target, 0)
      ).to.be.revertedWith("Caller is not seller");
    });
  });
});


