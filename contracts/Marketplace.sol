// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard{
    address public owner;
    uint256 public platformFeeBasisPoints = 250;
    uint256 public totalVolumeTraded; 
    uint256 public totalListings;   

    constructor() {
        owner = msg.sender;
    }

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == owner, "Not admin");
        _;
    }

    modifier onlySeller(address nft, uint256 tokenId) {
        require(listings[nft][tokenId].seller == msg.sender, "Caller is not seller");
        _;
    }

    // Struct
    struct Listing {
        address seller;
        uint256 price;
    }

    struct ListingId {
        address nft;
        uint256 tokenId;
    }

    // Data storage
    mapping(address => mapping(uint256 => Listing)) public listings;
    ListingId[] public listingsList; 

    // EVENTS
    event NFTListed(address indexed seller, address indexed nft, uint256 indexed tokenId, uint256 price);
    event NFTSold(address indexed buyer, address indexed nft, uint256 indexed tokenId, uint256 price);
    event ListingCanceled(address indexed seller, address indexed nft, uint256 indexed tokenId);
    event ListingUpdated(address indexed seller, address indexed nft, uint256 indexed tokenId, uint256 newPrice);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event VolumeUpdated(uint256 newTotal);
    event ListingsCountUpdated(uint256 newTotal);
    
    // Đăng bán NFT
    function listNFT(address nftAddress, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than 0");

        IERC721 token = IERC721(nftAddress);

        // Kiểm tra người gọi là chủ sở hữu NFT
        require(token.ownerOf(tokenId) == msg.sender, "Not the owner of NFT");

        // Kiểm tra đã approve marketplace để transfer token
        require(
            token.getApproved(tokenId) == address(this) || token.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        // Kiểm tra chưa được list trước đó (tuỳ chọn)
        require(listings[nftAddress][tokenId].price == 0, "Already listed");

        // List vào mapping
        listings[nftAddress][tokenId] = Listing(msg.sender, price);
        listingsList.push(ListingId(nftAddress, tokenId));
        totalListings++;

        emit ListingsCountUpdated(totalListings);
        emit NFTListed(msg.sender, nftAddress, tokenId, price);
    }

    // Mua NFT
    function buyNFT(address nft, uint256 tokenId) external payable nonReentrant {
        Listing memory item = listings[nft][tokenId];
        require(item.price > 0, "Not listed");
        require(msg.value == item.price, "Incorrect price");

        // Tính phí platform
        uint256 fee = (msg.value * platformFeeBasisPoints) / 10000;
        uint256 sellerAmount = msg.value - fee;
        totalVolumeTraded += msg.value;

        address seller = item.seller;
        uint256 price = item.price;

        // Xóa trước khi chuyển để tránh lỗi reentrancy
        delete listings[nft][tokenId];
        _removeListingFromList(nft, tokenId);

        // Chuyển tiền cho người bán
        payable(seller).transfer(sellerAmount);

        // Chuyển NFT
        IERC721(nft).safeTransferFrom(seller, msg.sender, tokenId);

        emit VolumeUpdated(totalVolumeTraded);
        emit NFTSold(msg.sender, nft, tokenId, price);
    }

    // Hủy đăng bán
    function cancelListing(address nft, uint256 tokenId) external onlySeller(nft, tokenId) {
        delete listings[nft][tokenId];
        _removeListingFromList(nft, tokenId); // ← Xoá khỏi mảng tracking
        emit ListingCanceled(msg.sender, nft, tokenId);
    }


    // Cập nhật giá
    function updateListing(address nft, uint256 tokenId, uint256 newPrice) external onlySeller(nft, tokenId){
        Listing storage item = listings[nft][tokenId];
        require(newPrice > 0, "Invalid price");

        item.price = newPrice;
        emit ListingUpdated(msg.sender, nft, tokenId, newPrice);
    }

    // Hàm rút tiền bởi Admin
    function withdrawTo(address to) external onlyAdmin {
        require(to != address(0), "Invalid address");
        payable(to).transfer(address(this).balance);
    }

    // Get function
    function getListing(address nftAddress, uint256 tokenId) public view returns (Listing memory) {
        return listings[nftAddress][tokenId];
    }

    function getAllListings() external view returns (ListingId[] memory) {
        return listingsList;
    }

    // Set function
    // Cập nhật phí nền tảng (tối đa 10%)
    function setPlatformFee(uint256 newFeeBasisPoints) external onlyAdmin {
        require(newFeeBasisPoints <= 1000, "Max fee is 10%");
        uint256 oldFee = platformFeeBasisPoints;
        platformFeeBasisPoints = newFeeBasisPoints;
        emit PlatformFeeUpdated(oldFee, newFeeBasisPoints);
    }

    // Internal Funcitons
    function _removeListingFromList(address nft, uint256 tokenId) internal {
        for (uint256 i = 0; i < listingsList.length; i++) {
            if (listingsList[i].nft == nft && listingsList[i].tokenId == tokenId) {
                listingsList[i] = listingsList[listingsList.length - 1]; // Gán phần tử cuối vào vị trí này
                listingsList.pop(); // Xoá phần tử cuối
                break;
            }
        }
    }
}