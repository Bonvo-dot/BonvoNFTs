import fs from "fs/promises";
import { getDefaultProvider, utils } from "ethers";
import { wallet } from "../config/constants";

const { deployUpgradable } = require("@axelar-network/axelar-gmp-sdk-solidity");

// load contracts
const ExampleProxy = require("../artifacts/contracts/Proxy.sol/ExampleProxy.json");
const NFTLinker = require("../artifacts/contracts/NFTLinker.sol/NFTLinker.json");

let chains = require("../config/testnet.json");

// get chains
const moonbeamChain = chains.find((chain) => chain.name === "Moonbeam");
const polygonChain = chains.find((chain) => chain.name === "Polygon");

// deploy script
async function deployNFTLinker(chain) {
  console.log(`\n*****${chain.name.toUpperCase()}*****`);
  const provider = getDefaultProvider(chain.rpc);
  const walletConnectedToProvider = wallet.connect(provider);

  const nftLinker = await deployUpgradable(
    chain.constAddressDeployer,
    walletConnectedToProvider,
    NFTLinker,
    ExampleProxy,
    [chain.gateway, chain.gasReceiver],
    [],
    utils.defaultAbiCoder.encode(["string"], [chain.name]),
    "nftLinker"
  );
  console.log(`NFTLinker deployed on ${chain.name}: ${nftLinker.address}`);
  chain.nftLinker = nftLinker.address;
}

async function main() {
  for await (let chain of [polygonChain, moonbeamChain]) {
    await deployNFTLinker(chain);
  }

  // update chains
  const updatedChains = [moonbeamChain, polygonChain];
  await fs.writeFile(
    "config/testnet.json",
    JSON.stringify(updatedChains, null, 2)
  );
}

main();
