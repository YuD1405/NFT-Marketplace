# 🖼️ NFT Marketplace Mini

Một dự án cá nhân mô phỏng lại một phần cơ bản của **OpenSea** – nơi người dùng có thể tạo, niêm yết và mua bán NFT trực tiếp trên blockchain.

## 🎯 Mục tiêu dự án

Xây dựng một hệ thống NFT Marketplace nhỏ gọn với các tính năng cốt lõi:

- ✅ Tạo (mint) NFT chuẩn [ERC721](https://eips.ethereum.org/EIPS/eip-721)
- ✅ Tích hợp metadata lưu trữ trên **IPFS**
- ✅ Niêm yết NFT để bán trên một marketplace on-chain
- ✅ Mua NFT từ người bán và chuyển quyền sở hữu
- ✅ Hiển thị các NFT mà người dùng đang sở hữu
- ✅ Frontend giao diện đơn giản kết nối qua `ethers.js` + MetaMask

---

## ⚙️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Smart Contract | Solidity + OpenZeppelin ERC721 |
| Dev Tool | Hardhat |
| IPFS | Pinata hoặc Web3.Storage |
| Frontend | HTML + JavaScript (Vanilla) + MetaMask |
| Deploy/Test | Hardhat Localnet (hoặc Mumbai Testnet) |

---

## 🧱 Kiến trúc hệ thống

```

User <-> MetaMask <-> Frontend (JS) <-> Smart Contract (Hardhat)
|
IPFS (ảnh, metadata)

```

- **NFTCollection.sol**: Contract ERC721 cho phép người dùng `mint()` NFT mới kèm metadata IPFS.
- **Marketplace.sol**: Contract cho phép list/mua NFT. Sử dụng `approve` và `transferFrom` để chuyển quyền sở hữu.
- **Frontend**: Giao diện đơn giản cho người dùng tương tác với MetaMask để mint/list/buy NFT.

---

## 📦 Các tính năng chính

### 1. Mint NFT
- Upload metadata (JSON) chứa `name`, `description`, `image` lên IPFS
- Gọi `mintNFT(ipfsMetadataUrl)` từ contract

### 2. List NFT for Sale
- Gọi `approve(marketplaceAddress, tokenId)`
- Gọi `listNFT(tokenId, price)` trên marketplace contract

### 3. Buy NFT
- Gửi ETH đến `buyNFT(tokenId)`
- Contract sẽ chuyển quyền sở hữu NFT cho buyer

### 4. View NFTs
- Gọi `tokenURI(tokenId)` → load từ IPFS → hiển thị ảnh, tên, mô tả

---

## 📚 Kế hoạch phát triển

| Ngày | Nội dung |
|------|----------|
| Day 1 | Setup Hardhat, phân tích ERC721 |
| Day 2 | Viết contract ERC721 + script deploy |
| Day 3 | Tích hợp IPFS metadata |
| Day 4 | Viết contract Marketplace: list & buy |
| Day 5 | Giao diện HTML + JS đơn giản |
| Day 6 | Hoàn thiện, kiểm thử, tối ưu |
| Day 7 | Viết báo cáo, cập nhật README, đưa lên GitHub |

---

## 🧠 Kiến thức rèn luyện

- ERC721, IPFS, approve & transferFrom, event, mapping
- Viết smart contract với Hardhat
- Triển khai ứng dụng Web3 frontend thuần JS
- Hiểu toàn bộ quy trình hoạt động của NFT marketplace

---

## 📎 License

MIT License
