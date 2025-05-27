const pinataSDK = require('@pinata/sdk');
const dotenv = require('dotenv');
const path = require('path');

// Load .env từ thư mục cha (gốc project)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.PINATA_API_KEY;
const secretKey = process.env.PINATA_SECRET_API_KEY;

if (!apiKey || !secretKey) {
  throw new Error("❌ Missing PINATA API keys in .env file");
}

const pinata = new pinataSDK(apiKey, secretKey);

async function uploadFolder() {
  const folderPath = path.join(__dirname, 'json'); 
  const options = {
    pinataMetadata: {
      name: 'Weapon-NFT-Json-Folder'
    }
  };

  try {
    const result = await pinata.pinFromFS(folderPath, options);
    console.log("✅ Folder uploaded to IPFS:");
    console.log("CID:", result.IpfsHash);
    console.log("Access via: https://gateway.pinata.cloud/ipfs/" + result.IpfsHash);
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

uploadFolder();
