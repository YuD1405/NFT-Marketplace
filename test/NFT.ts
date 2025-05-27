import { ethers } from "hardhat";
import { expect } from "chai";

describe("NFTCollection", () => {
  let nftContract: any;
  let owner: any, user1 : any, user2 : any;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFT");
    nftContract = await NFT.deploy("ipfs://QmdVPx2qrVD6vuaePN5CtL61WArTettLeKPUoGcsCYb6ur/"); // mặc định account[0] là owner , là ng deploy
    //await nftContract.deployed();
  });

  describe("Deployment", () => {
    // Kiểm tra contract được deploy, admin đúng
    it("should be deployed successfully with correct admin", async () => {
      const adminFromContract = await nftContract.admin();
      const ownerAddress = await owner.getAddress();
      expect(adminFromContract).to.equal(ownerAddress);
    });
  });

  describe("Minting", () => {
    // NFT được mint thành công
    it("should allow user to mint NFT successfully", async () => {
      await nftContract.connect(owner).mint();      
      const tokenId = await nftContract.tokenOfOwnerByIndex(owner.address, 0);
      expect(tokenId, "Should be 1 token Id for owner, token id = 0").to.equal(0);
    });

    // Ai cũng có thể mint (không cần admin)
    it("should allow any address to mint (not restricted to admin)", async () => {
      await nftContract.connect(user1).mint();       
      const tokenId_1 = await nftContract.tokenOfOwnerByIndex(user1.address, 0);
      expect(tokenId_1, "Should be 1 token Id for user 1, token id = 0").to.equal(0);

    });

    // Mint nhiều lần → tokenId tăng đúng
    it("should increment tokenId correctly with each mint", async () => {
      await nftContract.connect(user1).mint();    
      await nftContract.connect(user2).mint();    
      const tokenId_1 = await nftContract.tokenOfOwnerByIndex(user1.address, 0);
      expect(tokenId_1,"Should be 1 token Id for user 1, token id = 0").to.equal(0);
      const tokenId_2 = await nftContract.tokenOfOwnerByIndex(user2.address, 0);
      expect(tokenId_2, "Should be 1 token Id for user 2, token id = 1").to.equal(1);
    });
  });

  describe("Ownership", () => {
    // NFT thuộc về người mint
    it("should assign ownership of minted token to caller", async () => {
      await nftContract.connect(user1).mint();      
      const owner = await nftContract.ownerOf(0);
      expect(owner, "Should be user 1 - the mint-er of token id: 0").to.equal(user1.address);
    });

    // balanceOf đúng
    it("should return correct balance for user who owns NFTs ", async () => {
      await nftContract.connect(user1).mint();      
      await nftContract.connect(user1).mint();  
      const count = await nftContract.balanceOf(user1.address);
      expect(count, "Should be 2 nft for user 1").to.equal(2);
    });

    // tokenOfOwnerByIndex trả đúng tokenId
    it("should return correct tokenId via tokenOfOwnerByIndex", async () => {
      await nftContract.connect(user1).mint();      
      const tokenId_1 = await nftContract.tokenOfOwnerByIndex(user1.address, 0);
      expect(tokenId_1,"Should be 1 token Id for user 1, token id = 0").to.equal(0);
    });
  });

  describe("Token URI", () => {
    // Lấy tokenURI thành công với token hợp lệ
    it("should return correct tokenURI for existing token", async () => {
      await nftContract.connect(user1).mint();    
      const token1_URI = await nftContract.tokenURI(0);
      expect(token1_URI, "Should be 'ipfs://QmdVPx2qrVD6vuaePN5CtL61WArTettLeKPUoGcsCYb6ur/0.json'").to.equal("ipfs://QmdVPx2qrVD6vuaePN5CtL61WArTettLeKPUoGcsCYb6ur/0.json");
    });

    // Gây lỗi nếu gọi tokenURI với token chưa tồn tại
    it("should revert when tokenURI is called for nonexistent token", async () => {
      try {
        const token1_URI = await nftContract.tokenURI(0);
        expect.fail("The transaction should have reverted, but it didn't.");
      } catch (error: any) {
        expect(error.message).to.include("Token does not exist", "Should revert with correct error message");
      }
    });
  });

  describe("Interface Compliance", () => {
    it("should support ERC721 interface", async () => {
      expect(await nftContract.supportsInterface("0x80ac58cd")).to.equal(true);
    });

    it("should support ERC721Enumerable interface", async () => {
      expect(await nftContract.supportsInterface("0x780e9d63")).to.equal(true);
    });
  });
});
