/* eslint-disable no-undef */
import { Contract, getDefaultProvider, providers } from "ethers";
import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} from "@axelar-network/axelarjs-sdk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessageToast from "../moonbeam/MessageToast";
import NftLinker from "../abi/NFTLinker.json";
import ERC721 from "../abi/nftABI.json";
import { wallet } from "../config/constants";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { sleep } from "./sleep";

// const tokenId = 0;

const chains = require("../config/testnet.json");

const moonbeamChain = chains.find((chain) => chain.name === "Moonbeam");
const polygonChain = chains.find((chain) => chain.name === "Polygon");

export function updateContractsOnChainConfig(chain, address) {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new providers.Web3Provider(ethereum);
    chain.wallet = provider.getSigner(address);
    chain.erc721 = new Contract(chain.erc721, ERC721, chain.wallet);
    chain.contract = new Contract(chain.nftLinker, NftLinker, chain.wallet);
  }
}

export async function sendNftToDest(onSrcConfirmed, onSent, tokenId) {
  const owner = await ownerOf(moonbeamChain, tokenId);

  console.log({ owner });

  console.log("--- Initially ---", tokenId);
  await print();

  const gasFee = await getGasFee(
    EvmChain.MOONBEAM,
    EvmChain.POLYGON,
    GasToken.GLMR
  ).then((res) => {
    console.log(res);
    return res;
  });

  await (
    await moonbeamChain.erc721.approve(
      moonbeamChain.contract.address,
      owner.tokenId
    )
  ).wait();
  console.log(
    moonbeamChain.erc721,
    tokenId,
    moonbeamChain.name,
    wallet.address,
    {
      value: gasFee,
    }
  );

  try {
    const tx = await (
      await moonbeamChain.contract
        .sendNFT(
          moonbeamChain.erc721.address,
          tokenId,
          polygonChain.name,
          wallet.address,
          {
            value: gasFee,
          }
        )
        .then((res) => {
          console.log(res);
          toast(<MessageToast txHash={res.hash} />, {
            autoClose: 5000,
          });
          return res;
        })
        .catch((err) => {
          console.log(err);
        })
    ).wait();

    console.log("tx", tx);
    onSrcConfirmed(tx.transactionHash);
  } catch (err) {
    console.log(err);
  }

  while (true) {
    const owner = await ownerOf();

    if (owner.chain === polygonChain.name) {
      onSent(owner);
      break;
    }

    await sleep(10000);
  }

  console.log("--- Then ---");
  await print();
}

export async function sendNftBack(onSrcConfirmed, onSent, tokenId) {
  const owner = await ownerOf(polygonChain, tokenId);

  console.log({ owner });

  console.log("--- Initially ---", tokenId);
  await print();

  const gasFee = await getGasFee(
    EvmChain.POLYGON,
    EvmChain.MOONBEAM,
    GasToken.MATIC
  ).then((res) => {
    console.log(res);
    return res;
  });

  await (
    await polygonChain.erc721.approve(
      polygonChain.contract.address,
      owner.tokenId
    )
  ).wait();
  console.log(polygonChain.erc721, tokenId, polygonChain.name, wallet.address, {
    value: gasFee,
  });

  try {
    const tx = await (
      await polygonChain.contract
        .sendNFT(
          polygonChain.erc721.address,
          tokenId,
          polygonChain.name,
          wallet.address,
          {
            value: gasFee,
          }
        )
        .then((res) => {
          console.log(res);
          toast(<MessageToast txHash={res.hash} />, {
            autoClose: 5000,
          });
          return res;
        })
        .catch((err) => {
          console.log(err);
        })
    ).wait();

    console.log("tx", tx);
    onSrcConfirmed(tx.transactionHash);
  } catch (err) {
    console.log(err);
  }

  while (true) {
    const owner = await ownerOf();

    if (owner.chain === moonbeamChain.name) {
      onSent(owner);
      break;
    }

    await sleep(10000);
  }

  console.log("--- Then ---");
  await print();
}

export function truncatedAddress(address) {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 10)
  );
}

export const ownerOf = async (chain = moonbeamChain, tokenId = 0) => {
  const operator = moonbeamChain.erc721;
  const owner = await operator.ownerOf(tokenId);
  const metadata = await operator
    .tokenURI(tokenId)
    .then(async (res) => {
      let data = await fetch(res)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          return res.image;
        });
      return data;
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(owner, metadata);

  if (owner !== chain.contract.address) {
    return {
      chain: chain.name,
      address: owner,
      tokenId: tokenId,
      tokenURI: metadata,
    };
  }

  const newTokenId = BigInt(
    keccak256(
      defaultAbiCoder.encode(
        ["string", "address", "uint256", "string"],
        [chain.name, operator.address, tokenId, metadata]
      )
    )
  );

  for (const checkingChain of [moonbeamChain, polygonChain]) {
    if (checkingChain === chain) continue;

    try {
      const address = await checkingChain.contract.ownerOf(newTokenId);
      return {
        chain: checkingChain.name,
        address,
        tokenId: newTokenId,
        tokenURI: metadata,
      };
    } catch (e) {}
  }

  return { chain: "" };
};

async function print() {
  for (const chain of chains) {
    const owner = await ownerOf(chain);
    console.log(
      `Token that was originally minted at ${chain.name} is at ${owner.chain}.`
    );
  }
}

const getGasFee = async (
  sourceChainName,
  destinationChainName,
  sourceChainTokenSymbol,
  estimatedGasUsed
) => {
  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
  const gasFee = await api.estimateGasFee(
    sourceChainName,
    destinationChainName,
    sourceChainTokenSymbol
  );
  return gasFee;
};
