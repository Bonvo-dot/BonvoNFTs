import { Wallet } from "ethers";

if (typeof window === "undefined") {
  require("dotenv").config();
}

function getWallet() {
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  return new Wallet(privateKey);
}

export const wallet = getWallet();
