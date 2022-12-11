import { ethers, utils } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import nftABI from "../abi/nftABI.json";
import ContractABI from "../abi/ContractABI.json";

import ContextWeb3 from "./ContextWeb3";
import { contractAddress } from "./AddPropertyForm";
import { useCallback } from "react";
import { sendNftToDest } from "../utils/SendNFT";

export const NFTcontractAddress = utils.getAddress(
  "0xa198d69Aae7c1cC14E30De7036ca5BEdbd7B6941"
);

const API_KEY = "5N99J7JV1CY9FIDB54MI2961WSUMQN677P";

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
  const [destTxHash, setDestTxHash] = useState("");
  const request = `https://api-moonbase.moonscan.io/api?module=account&action=tokennfttx&address=${state.address}&startblock=0&endblock=999999999&sort=asc`;
  useEffect(() => {
    const fetchProperties = async () => {
      if (state.address?.length > 0) {
        let tokenIds = [];
        await fetch(request)
          .then((res) => res.json())
          .then((data) => {
            let res = data.result.filter(
              (item) =>
                utils.getAddress(item.contractAddress) === NFTcontractAddress &&
                item.to === state.address
            );
            console.log(res);
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

  console.log(tokenId);
  console.log(properties);

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
                    assets = [...assets, txAsset];
                    console.log(assets);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                console.log(assets);
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
          console.log(properties);
          let assets = [...properties];
          properties.map(async (item, idx) => {
            await contract.tokenURI(item.tokenId).then(async (tx) => {
              let res = await fetch(tx);
              let data = await res.json();
              console.log(data);
              assets[idx].image = data.image;
            });
            console.log(assets);
          });
          setProperties(assets);
          // tokenId.map(async (item, idx) => {
          //   await contract.tokenURI(item).then(async (tx) => {
          //     let res = await fetch(tx);
          //     let data = await res.json();
          //     console.log(data);
          //     console.log(properties);
          //     let newProperties = [...properties];
          //     newProperties[idx].image = data.image;
          //     setProperties(newProperties);
          //   });
          // });
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
      console.log("fetchImages");
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

  async function handleSendSource(e, tokenId) {
    e.preventDefault();
    setLoading(true);

    const onSrcConfirmed = (txhash) => {
      setDestTxHash("");
      setTxhash(txhash);
    };

    const onSent = (owner) => {
      setOwner(owner);
      setLoading(false);
    };

    await sendNftToDest(onSrcConfirmed, onSent, tokenId);
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
                    {loading && (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    <button
                      className="btn
                    btn-primary btn-sm"
                      onClick={(e) => handleSendSource(e, property?.tokenId)}
                    >
                      Enviar a Polygon
                    </button>
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
      </div>
    </div>
  );
};
