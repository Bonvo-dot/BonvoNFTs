/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useContext } from "react";
import { ethers, providers, utils } from "ethers";
import detectProvider from "@metamask/detect-provider";
import { Link } from "react-router-dom";
import ContextWeb3 from "./ContextWeb3";

const providerRPC = {
  moonbase: {
    name: "moonbase-alpha",
    rpc: "https://rpc.api.moonbase.moonbeam.network",
    chainId: 1287, // 0x507 in hex,
  },
};

const ConnectWallet = () => {
  const { state, dispatch } = useContext(ContextWeb3);
  const { provider, web3Provider, address, chainId } = state;

  useEffect(() => {
    const init = async () => {
      if (localStorage.getItem("address")) {
        MoonbeamAlphaChain();
      }
      // Check for changes in Metamask (account and chain)
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            dispatch({
              type: "SET_ADDRESS",
              address: accounts[0],
            });
          } else {
            dispatch({
              type: "RESET_WEB3_PROVIDER",
            });
          }
        });
        window.ethereum.on("chainChanged", async (chainId) => {
          const provider = await detectProvider({ mustBeMetaMask: true });
          if (chainId !== "0x507") {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x507" }],
            });
          }
        });
      }
    };
    init();
  }, []);

  const MoonbeamAlphaChain = useCallback(async () => {
    const provider = await detectProvider({ mustBeMetaMask: true });

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x507",
            chainName: "Moonbase Alpha",
            nativeCurrency: {
              name: "DEV",
              symbol: "DEV",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
            blockExplorerUrls: ["https://moonbase.moonscan.io/"],
          },
        ],
      });

      const address = accounts[0];
      const web3Provider = new providers.StaticJsonRpcProvider(
        providerRPC.moonbase.rpc,
        {
          chainId: providerRPC.moonbase.chainId,
          name: providerRPC.moonbase.name,
        }
      );

      dispatch({
        type: "SET_WEB3_PROVIDER",
        provider,
        web3Provider,
        address,
        chainId: 1287,
      });
    } catch (addError) {
      console.log(addError);
    }
  }, []);

  const onConnect = useCallback(async () => {
    await MoonbeamAlphaChain();
  }, []);

  const disconnect = useCallback(
    async function () {
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
    },
    [provider]
  );

  useEffect(() => {
    if (provider?.on) {
      const handleDisconnect = (error) => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  return (
    <div>
      {address ? (
        <div className="ltn__drop-menu user-menu">
          <ul>
            <li>
              <div className="btn theme-btn-1 text-uppercase">
                {address?.slice(0, 6) + "..." + address?.slice(-4)}
              </div>
              <ul className="go-top">
                <li>
                  <Link to="/my-account">Mi Cuenta</Link>
                </li>
                <li style={{ cursor: "pointer" }} onClick={disconnect}>
                  Desconectarme
                </li>
              </ul>
            </li>
          </ul>
        </div>
      ) : (
        <button
          className="btn theme-btn-1 btn-effect-4 text-uppercase"
          onClick={onConnect}
          style={{ padding: "10px 40px" }}
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
