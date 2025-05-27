import { ethers } from "hardhat";
import { ethers as originalEthers } from "ethers";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Marketplace", () => {
  let marketplace: any;
  let nftContract: any;
  let owner: HardhatEthersSigner;
  let seller: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;


  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();
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
      const ownerAddress = await owner.getAddress();
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

      it("should increment totalListings", async () => {
      
      });

      it("should emit NFTListed and ListingsCountUpdated", async () => {
      
      });

    });

    xcontext("when listing fails", () => {
      it("should revert if not the NFT owner", async () => {
      
      });

      it("should revert if price is zero", async () => {
      
      });

      it("should revert if marketplace is not approved", async () => {
      
      });

      it("should revert if NFT is already listed", async () => {
      
      });

    });
  });

  xdescribe("Buying NFT", () => {
    context("when buying a listed NFT", () => {
      it("should transfer NFT to buyer", async () => {
      
      });

      it("should transfer ETH to seller (after fee)", async () => {
      
      });

      it("should increase totalVolumeTraded", async () => {
      
      });

      it("should emit NFTSold and VolumeUpdated", async () => {
      
      });

      it("should remove NFT from listings and listingsList", async () => {
      
      });
    });

    context("when buying fails", () => {
      it("should revert if NFT is not listed", async () => {
      
      });

      it("should revert if value sent is incorrect", async () => {
      
      });
    });
  });

  xdescribe("Canceling listing", () => {
    it("should allow seller to cancel listing", async () => {
      
    });

    it("should remove listing from mapping and listingsList", async () => {
      
    });

    it("should emit ListingCanceled", async () => {
      
    });

    it("should revert if caller is not the seller", async () => {
      
    });
  });

  xdescribe("Updating listing price", () => {
    it("should allow seller to update price", async () => {
      
    });

    it("should emit ListingUpdated with new price", async () => {
      
    });

    it("should revert if new price is zero", async () => {
      
    });

    it("should revert if caller is not seller", async () => {
      
    });
  });

  xdescribe("Withdraw function", () => {
    it("should allow admin to withdraw full balance to given address", async () => {
      
    });

    it("should revert if non-admin calls", async () => {
      
    });

    it("should revert if to-address is zero", async () => {
      
    });
  });

  xdescribe("Platform fee management", () => {
    it("should allow admin to update platform fee", async () => {
      
    });

    it("should emit PlatformFeeUpdated", async () => {
      
    });

    it("should revert if non-admin calls", async () => {
      
    });

    it("should revert if new fee > 10%", async () => {
      
    });
  });

  xdescribe("Getters", () => {
    it("getListing() should return correct seller and price", async () => {
      
    });

    it("getAllListings() should return all currently listed NFTs", async () => {
      
    });
  });

  xdescribe("Internal logic - _removeListingFromList", () => {
    it("should remove listing correctly from listingsList", async () => {
      
    });

    it("should not break array structure", async () => {
      
    });

    it("should handle edge case: last element being removed", async () => {
      
    });
  });

  xdescribe("Security & Modifiers", () => {
    it("onlyAdmin should restrict access to admin-only functions", async () => {
      
    });

    it("onlySeller should restrict access to listing management", async () => {
      
    });

    it("nonReentrant should prevent reentrancy attack in buyNFT", async () => {
      
    });
  });
  
});


