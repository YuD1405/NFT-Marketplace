import { HardhatUserConfig } from "hardhat/config";
import { task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { formatEther } from "ethers"; // ✅ ethers v6: lấy hàm trực tiếp

task("accounts", "Prints the list of accounts with balance", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (let i = 0; i < accounts.length; i++) {
    const address = await accounts[i].getAddress();
    const balance = await hre.ethers.provider.getBalance(address);
    const balanceInEth = formatEther(balance); // ✅ đúng cú pháp

    console.log(`Account[${i}] : ${address} - ${balanceInEth} ETH`);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  // networks: {
  //   sepolia: {
  //     url: process.env.SEPOLIA_RPC_URL || "",
  //     accounts: [process.env.PRIVATE_KEY || ""]
  //   },
  //   localhost: {
  //     url: "http://127.0.0.1:8545"
  //   }
  // }
};

export default config;
