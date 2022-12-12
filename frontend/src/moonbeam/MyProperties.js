import { ethers, utils } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import nftABI from "../abi/nftABI.json";
import ContractABI from "../abi/ContractABI.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContextWeb3 from "./ContextWeb3";
import { contractAddress } from "./AddPropertyForm";
import { useCallback } from "react";
import {
  sendNftBack,
  sendNftToDest,
  updateContractsOnChainConfig,
} from "../utils/SendNFT";

export const NFTcontractAddress = utils.getAddress(
  "0xa198d69Aae7c1cC14E30De7036ca5BEdbd7B6941"
);
const NFTLinkerAddress = utils.getAddress(
  "0x84c4cc1552e65a1ab2b3c1847c0f239a7d4dfca8"
);
const chains = require("../config/testnet.json");

export const MyProperties = ({ user }) => {
  let publicUrl = process.env.PUBLIC_URL + "/";
  const { state } = useContext(ContextWeb3);

  const [properties, setProperties] = useState([]);
  const [fetchAll, setFetchAll] = useState(false);
  const [fetchTokenId, setFetchTokenId] = useState(false);
  const [fetchProperties, setFetchProperties] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [txhash, setTxhash] = useState("");
  const [owner, setOwner] = useState("");
  const [hasTransfer, setHasTransfer] = useState("");
  const [destTxHash, setDestTxHash] = useState("");
  const request = `https://api-moonbase.moonscan.io/api?module=account&action=tokennfttx&address=${state.address}&startblock=0&endblock=999999999&sort=asc`;
  useEffect(() => {
    const fetchProperties = async () => {
      if (state.address?.length > 0) {
        let tokenIds = [];
        let tokenIds2 = [];
        await fetch(request)
          .then((res) => res.json())
          .then((data) => {
            let allTokens = data.result;
            let hasTransfer = allTokens.filter(
              (item) =>
                utils.getAddress(item.contractAddress) === NFTcontractAddress &&
                item.from === state.address
            );
            if (hasTransfer.length > 0) {
              tokenIds2 = hasTransfer.map((item) => item.tokenID);
              setHasTransfer(tokenIds2);
            }
            let res = data.result.filter(
              (item) =>
                utils.getAddress(item.contractAddress) === NFTcontractAddress &&
                item.to === state.address
            );
            tokenIds = res.map((item) => item.tokenID);
            setTokenId(tokenIds);
            setFetchTokenId(true);
          });
      }
    };
    if (!fetchTokenId) {
      fetchProperties();
    }
  }, [state.address, request, fetchTokenId, tokenId]);

  /* Fetch Asset */
  useEffect(() => {
    const fetchAsset = async () => {
      if (state.address && user.idUser === "" && fetchTokenId) {
        try {
          const { ethereum } = window;
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner(state.address);
            const contract = new ethers.Contract(
              contractAddress,
              ContractABI,
              signer
            );
            if (tokenId.length > 1) {
              let assets = [];
              tokenId.map(async (item) => {
                await contract
                  .assetsByTokenId(item)
                  .then(async (tx) => {
                    const txAsset = {
                      timestamp: new Date(
                        tx.timestamp.toNumber()
                      ).toLocaleDateString(),
                      tokenId: tx.tokenId.toNumber(),
                      price: tx.price.toNumber(),
                      idCategory: tx.idCategory,
                      ISOCountry: tx.ISOCountry,
                      owner: tx.owner,
                      staticData: {
                        title: tx.staticData.title,
                        description: tx.staticData.description,
                        rooms: tx.staticData.rooms.toNumber(),
                        location: tx.staticData.location,
                        size: tx.staticData.size.toNumber(),
                      },
                      image: "",
                    };
                    assets = [...assets, txAsset];
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                setProperties(assets);
              });
            }
            if (tokenId.length === 1) {
              const transaction = await contract
                .assetsByTokenId(tokenId[0])
                .then(async (tx) => {
                  console.log(tx);
                  const txAsset = {
                    timestamp: new Date(
                      tx.timestamp.toNumber()
                    ).toLocaleDateString(),
                    tokenId: tx.tokenId.toNumber(),
                    price: tx.price.toNumber(),
                    idCategory: tx.idCategory,
                    ISOCountry: tx.ISOCountry,
                    owner: tx.owner,
                    staticData: {
                      title: tx.staticData.title,
                      description: tx.staticData.description,
                      rooms: tx.staticData.rooms.toNumber(),
                      location: tx.staticData.location,
                      size: tx.staticData.size.toNumber(),
                    },
                    image: "",
                  };

                  setProperties((prev) => [...prev, txAsset]);
                })
                .catch((error) => {
                  console.log(error);
                });
              await transaction?.wait();
            }
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };
    if (!fetchAll && !fetchProperties && fetchTokenId) {
      fetchAsset();
      if (tokenId.length === properties.length) {
        console.log("fetchProperties");
        setFetchProperties(true);
      }
    }
  }, [
    user,
    state,
    tokenId,
    fetchTokenId,
    fetchProperties,
    fetchAll,
    properties,
  ]);

  const fetchImages = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(state.address);
        const contract = new ethers.Contract(
          NFTcontractAddress,
          nftABI,
          signer
        );
        if (
          tokenId.length > 0 &&
          properties.length > 0 &&
          !fetchAll &&
          fetchProperties
        ) {
          let assets = [...properties];
          properties.map(async (item, idx) => {
            await contract.tokenURI(item.tokenId).then(async (tx) => {
              let res = await fetch(tx);
              let data = await res.json();
              if (data.image.split("/")[0] === "ipfs:") {
                let ipfs = data.image.split("/")[2];
                await fetch(
                  `https://${ipfs}.ipfs.dweb.link/metadata.json`
                ).then(async (res) => {
                  let data = await res.json();
                  let cid = data.image.split("/")[2];
                  let name = data.image.split("/")[3];
                  assets[idx].image = `https://${cid}.ipfs.dweb.link/${name}`;
                });
              } else {
                assets[idx].image = data.image;
              }
            });
          });
          setProperties(assets);
        }
        if (
          tokenId.length === 1 &&
          properties.length === 1 &&
          !fetchAll &&
          fetchProperties
        ) {
          await contract.tokenURI(tokenId).then(async (tx) => {
            let res = await fetch(tx);
            let data = await res.json();
            let newProperties = [...properties];
            newProperties[0].image = data.image;
            setProperties(newProperties);
          });
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [tokenId, properties, fetchAll, state, fetchProperties]);

  useEffect(() => {
    if (properties.length > 0 && !fetchAll && fetchTokenId && fetchProperties) {
      fetchImages();
      if (properties.length === tokenId.length && properties[0].image !== "") {
        setFetchAll(true);
        console.log("fetchAll", fetchAll);
      }
    }
  }, [
    properties,
    fetchAll,
    fetchImages,
    fetchTokenId,
    fetchProperties,
    tokenId,
  ]);

  const moonbeamChain = chains.find((chain) => chain.name === "Moonbeam");
  const polygonChain = chains.find((chain) => chain.name === "Polygon");

  async function handleSendSource(e, tokenId) {
    updateContractsOnChainConfig(moonbeamChain, state.address);
    updateContractsOnChainConfig(polygonChain, state.address);
    e.preventDefault();
    setLoading(true);
    const id = toast.loading(
      "Transacción en progreso. Por favor, espere la confirmación...",
      {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
    const onSrcConfirmed = (txhash) => {
      setDestTxHash("");
      toast.update(id, {
        render: `
        Transacción realizada correctamente! 🎉
        `,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      setLoading(false);
      setTxhash(txhash);
    };

    const onSent = (owner) => {
      setOwner(owner);
      setLoading(false);
    };

    await sendNftToDest(onSrcConfirmed, onSent, tokenId);
  }

  async function handleSendBack(e, tokenId) {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading(
      "Transacción en progreso. Por favor, espere la confirmación...",
      {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
    const onSrcConfirmed = (txhash) => {
      setDestTxHash("");
      toast.update(id, {
        render: `
        Transacción realizada correctamente! 🎉
        `,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      setTxhash(txhash);
      setLoading(false);
    };

    const onSent = (owner) => {
      setOwner(owner);
      setLoading(false);
    };

    await sendNftBack(onSrcConfirmed, onSent, tokenId);
  }

  return (
    <div className="ltn__myaccount-tab-content-inner">
      <div className="ltn__my-properties-table table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Mis propiedades</th>
              <th scope="col" />
              <th scope="col">Fecha de ingreso</th>
              <th scope="col">Cambiar Red</th>
            </tr>
          </thead>
          <tbody>
            {fetchAll &&
              properties?.map((property, index) => (
                <tr key={index}>
                  <td className="ltn__my-properties-table-img">
                    <img
                      src={property.image}
                      alt="Property"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="ltn__my-properties-table-title">
                    <h4>
                      <Link to="/property-details">
                        {property?.staticData.title}
                      </Link>
                    </h4>
                    <span>{property?.staticData.location}</span>
                  </td>
                  <td className="ltn__my-properties-table-date">
                    <span>{property?.timestamp}</span>
                  </td>
                  <td className="ltn__my-properties-table-red">
                    {loading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : hasTransfer.includes(property?.tokenId.toString()) ? (
                      <button
                        className="btn
                      btn-primary btn-sm"
                        onClick={(e) => handleSendBack(e, property?.tokenId)}
                      >
                        Traer de Polygon
                      </button>
                    ) : (
                      <button
                        className="btn
                    btn-primary btn-sm"
                        onClick={(e) => handleSendSource(e, property?.tokenId)}
                      >
                        Enviar a Polygon
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="ltn__pagination-area text-center">
        <div className="ltn__pagination">
          <ul>
            <li>
              <Link to="#">
                <i className="fas fa-angle-double-left" />
              </Link>
            </li>
            <li>
              <Link to="#">1</Link>
            </li>
            <li className="active">
              <Link to="#">2</Link>
            </li>
            <li>
              <Link to="#">3</Link>
            </li>
            <li>
              <Link to="#">...</Link>
            </li>
            <li>
              <Link to="#">10</Link>
            </li>
            <li>
              <Link to="#">
                <i className="fas fa-angle-double-right" />
              </Link>
            </li>
          </ul>
        </div>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};
