import { Wallet } from "ethers";

function getWallet() {
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  return new Wallet(privateKey);
}

export const wallet = getWallet();
