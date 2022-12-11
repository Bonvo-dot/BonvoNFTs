import { Wallet } from "ethers";

if (typeof window === "undefined") {
  require("dotenv").config();
}

function getWallet() {
  const privateKey = process.env.PRIVATE_KEY as string;
  console.log('first')
  return new Wallet(privateKey)
}

export const wallet = getWallet();
