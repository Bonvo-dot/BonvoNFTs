import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  // networks: {
  // },
  // etherscan: {
  //   apiKey: process.env.POLYGONSCAN_API_KEY,
  // },
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/Ksd4J1QVWaOJAJJNbr_nzTcJBJU-6uP3",
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY || "default"],
    },
    moonbeam: {
      url: "https://rpc.api.moonbase.moonbeam.network",
      chainId: 0x507,
      accounts: [process.env.PRIVATE_KEY || "default"],
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY_MUMBAI,
    // apiKey: process.env.API_KEY_MOONBEAM,
  },
};

export default config;
