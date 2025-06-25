# 🧙‍♂️ NFT Marketplace – Web3 Game Card Style

Một ứng dụng NFT Marketplace phi tập trung, nơi người dùng có thể kết nối ví, mint NFT, mua bán và duyệt qua bộ sưu tập NFT phong cách game-card. Dự án sử dụng **React + TypeScript + ethers.js + Hardhat**, hỗ trợ IPFS, UI hiện đại và tích hợp Web3 đầy đủ.

---

## 📁 Cấu trúc thư mục chính

```bash
NFT-Marketplace/
│
├── Accounts_Local/       # Tài khoản Ethereum cho mạng cục bộ
├── artifacts/            # Output khi compile smart contract
├── cache/                # Cache biên dịch hardhat
├── contracts/            # Chứa các smart contract (ERC721, Marketplace)
├── coverage/             # Báo cáo coverage test
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── abi/                  # ABI contract JSON
│   │   ├── components/           # UI component thuần
│   │   ├── hooks/                # Custom React hooks: useWallet, useNFT, useMarketplace,...
│   │   ├── pages/                # Các page chính (route-level): Home, Mint, Buy, Detail,...
│   │   ├── material/             # images, bg,...
│   │   ├── test/                 # các file test
│   │   ├── utils/                # Hàm tiện ích: formatEther, shortenAddress, ipfsToHttp,...
│   │   ├── App.tsx               
│   │   ├── App.css
│   │   ├── config.ts             # Lưu các biến địa chỉ
│   │   ├── index.tsx
│   │   └── index.css              
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json         # Hàm tiện ích: formatEther, truncateAddr,...
├── ignition/             # Deploy logic dùng Hardhat Ignition
├── metadata/             # Chứa file metadata JSON để upload IPFS
├── node_modules/
├── scripts/              # Script deploy và tương tác với contract
├── test/                 # Test smart contract
├── typechain-types/      # Typechain bindings cho ethers
│
├── .env                  # Biến môi trường (Infura, Private Key,...)
├── .gitignore
├── coverage.json
├── hardhat.config.ts     # Cấu hình mạng, compiler, plugin cho Hardhat
├── package.json
├── tsconfig.json
└── README.md             # Tài liệu hướng dẫn
````

---

## 🚀 Tính năng chính

### 🦊 Kết nối ví

* Kết nối ví MetaMask qua `ethers.js`.
* Tự động nhận biết khi đổi network/account.
* Toast thông báo mỗi sự kiện (kết nối, lỗi, đổi mạng,...).

### 🎨 Hiển thị NFT của người dùng

* Truy vấn NFT đang sở hữu từ contract ERC721.
* Đọc metadata từ IPFS (qua tokenURI).
* Hiển thị ảnh, tên, và các thuộc tính như:

  * `Element`, `Rarity`, `Skill`, `Weapon Type`, `Price estimate`.

### 🪄 Mint NFT

* Tự gọi `mint()` từ smart contract.
* Upload metadata lên IPFS (có thể dùng NFT.Storage).
* Cập nhật UI sau khi mint xong.

### 🛒 List NFT

* Hiển thị các NFT chưa list.
* Cho phép nhập giá (ETH) để list.
* Gọi `approve()` và `listNFT()` từ Marketplace contract.

### 🧾 Your Listings

* Hiển thị danh sách các NFT đã list lên sàn.
* Có thể nhấn vào để xem chi tiết từng NFT.

### 💰 Mua NFT

* Hiển thị tất cả NFT của người khác đang được list.
* Cho phép click → xem chi tiết → Confirm Buy.
* Gọi `buyNFT(tokenId)` với đúng giá.

---

## 🛠️ Cài đặt & chạy dự án

### 1. Clone và cài đặt

```bash
git clone https://github.com/yourname/nft-marketplace.git
cd NFT-Marketplace
npm install
cd frontend
npm install
```

### 2. Chạy local blockchain & deploy

```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Chạy frontend

```bash
cd frontend
npm run dev
```

---

## ⚙ Công nghệ sử dụng

| Layer          | Tech Stack                                  |
| -------------- | ------------------------------------------- |
| Smart Contract | Solidity, Hardhat, TypeChain                |
| Frontend       | React, TypeScript, Vite, TailwindCSS        |
| Web3           | ethers.js, MetaMask                         |
| Storage        | IPFS (NFT.Storage, Pinata)                  |
| UI             | Orbitron Font, Toastify, Attribute-based UI |

---
