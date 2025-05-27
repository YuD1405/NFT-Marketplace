// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";  
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721Enumerable  {
    uint256 public nextTokenId;
    address public admin;
    using Strings for uint256;
    string public baseTokenURI;

    constructor(string memory _baseTokenURI) ERC721("MyNFT", "MNFT") {
        admin = msg.sender;
        baseTokenURI = _baseTokenURI;
    }
    
   function mint() external returns (uint256) {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        nextTokenId++;
        return tokenId;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        address owner = _ownerOf(_tokenId);
        require(owner != address(0), "Token does not exist");

        uint256 displayId = _tokenId + 1;
        return string(abi.encodePacked(baseTokenURI, "NFT_", displayId.toString(), ".json"));
    }
}