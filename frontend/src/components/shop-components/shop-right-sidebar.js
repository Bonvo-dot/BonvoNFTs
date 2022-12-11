import { ethers, FixedNumber } from "ethers";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { contractAddress } from "../../moonbeam/AddPropertyForm";
import ContextWeb3 from "../../moonbeam/ContextWeb3";
import ContractABI from "../../abi/ContractABI.json";

import Sidebar from "./shop-sidebar";
import useGeoLocation from "../helpers/useGeoLocation";

const ShopGridV1 = () => {
  let publicUrl = process.env.PUBLIC_URL + "/";
  const { state } = useContext(ContextWeb3);
  const [assets, setAssets] = useState([]);
  const [propLoaded, setPropLoaded] = useState(false);
  const location = useGeoLocation();
  const [locationUser, setLocationUser] = useState({
    latitude: 0,
    longitude: 0,
    ISOCountry: "",
  });
  const [filterByCategory, setFilterByCategory] = useState("");
  const [filterByCountry, setFilterByCountry] = useState("");
  const [filterByPrice, setFilterByPrice] = useState("");
  const [filterByDistance, setFilterByDistance] = useState("");
  const [filterByReputation, setFilterByReputation] = useState("");
  const [filterByRating, setFilterByRating] = useState("");

  useEffect(() => {
    const stored_location = JSON.parse(localStorage.getItem("stored_location"));
    if (stored_location) {
      setLocationUser(stored_location);
    } else {
      if (location?.coordinates.lat && locationUser.latitude === 0) {
        const location_to_storage = {
          latitude: FixedNumber.from(
            `${location.coordinates.lat}`,
            "fixed128x18"
          ),
          longitude: FixedNumber.from(
            `${location.coordinates.lng}`,
            "fixed128x18"
          ),
          ISOCountry: location.countryName,
        };
        setLocationUser(location_to_storage);
        localStorage.setItem(
          "stored_location",
          JSON.stringify(location_to_storage)
        );
      }
    }
  }, [location]);

  /* Fecth Asset by id */
  useEffect(() => {
    const fetchAsset = async () => {
      if (state.address && assets.length === 0) {
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

            if (locationUser.latitude !== 0) {
              await contract
                .assetsNearMeNotCategory(
                  locationUser.latitude,
                  locationUser.longitude,
                  locationUser.ISOCountry
                )
                .then(async (tx) => {
                  tx.map(async (element) => {
                    const txAsset = {
                      timestamp: new Date(
                        element.timestamp.toNumber()
                      ).toLocaleDateString(),
                      tokenId: element.tokenId.toNumber(),
                      price: element.price.toNumber(),
                      idCategory: element.idCategory,
                      ISOCountry: element.ISOCountry,
                      owner: element.owner,
                      images: element.images,
                      staticData: {
                        title: element.staticData.title,
                        description: element.staticData.description,
                        rooms: element.staticData.rooms.toNumber(),
                        location: element.staticData.location,
                        size: element.staticData.size.toNumber(),
                      },
                    };
                    setAssets((asset) => [txAsset, ...asset]);
                    setPropLoaded((loaded) => [true]);
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };
    fetchAsset();
  }, [state, locationUser]);

  useEffect(() => {
    const fetchAssetByCategory = async () => {
      if (state.address && filterByCategory !== "") {
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

            if (locationUser.latitude !== 0 && filterByCategory !== "") {
              console.log(filterByCategory);
              await contract
                .assetsNearMeCategory(
                  locationUser.latitude,
                  locationUser.longitude,
                  locationUser.ISOCountry,
                  filterByCategory
                )
                .then(async (tx) => {
                  console.log(tx);
                  tx.map(async (element) => {
                    const txAsset = {
                      timestamp: new Date(
                        element.timestamp.toNumber()
                      ).toLocaleDateString(),
                      tokenId: element.tokenId.toNumber(),
                      price: element.price.toNumber(),
                      idCategory: element.idCategory,
                      ISOCountry: element.ISOCountry,
                      owner: element.owner,
                      images: element.images,
                      staticData: {
                        title: element.staticData.title,
                        description: element.staticData.description,
                        rooms: element.staticData.rooms.toNumber(),
                        location: element.staticData.location,
                        size: element.staticData.size.toNumber(),
                      },
                    };
                    setAssets((asset) => [txAsset, ...asset]);
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };
    fetchAssetByCategory();
  }, [state, locationUser, filterByCategory]);

  return (
    <div>
      <div className="ltn__product-area ltn__product-gutter">
        <div className="container">
          <div className="row">
            <div className="col-lg-8  mb-100">
              <div className="ltn__shop-options">
                <ul className="justify-content-start">
                  <li>
                    <div className="ltn__grid-list-tab-menu ">
                      <div className="nav">
                        <a
                          className="active show"
                          data-bs-toggle="tab"
                          href="#liton_product_grid"
                        >
                          <i className="fas fa-th-large" />
                        </a>
                        <a data-bs-toggle="tab" href="#liton_product_list">
                          <i className="fas fa-list" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="d-none">
                    <div className="showing-product-number text-right">
                      <span>Showing 1–12 of 18 results</span>
                    </div>
                  </li>
                  <li>
                    <div className="short-by text-center">
                      <select className="nice-select">
                        <option>Ordenar por:</option>
                        <option>Precio</option>
                        <option>Mas recientes</option>
                        <option>Populares</option>
                      </select>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="tab-content">
                <div
                  className="tab-pane fade active show"
                  id="liton_product_grid"
                >
                  <div className="ltn__product-tab-content-inner ltn__product-grid-view">
                    <div className="row">
                      <div className="col-lg-12">
                        {/* Search Widget */}
                        <div className="ltn__search-widget mb-30">
                          <form action="#">
                            <input
                              type="text"
                              name="search"
                              placeholder="Filtrar..."
                            />
                            <button type="submit">
                              <i className="fas fa-search" />
                            </button>
                          </form>
                        </div>
                      </div>
                      {!propLoaded &&
                        !assets.length &&
                        "Para cargar las propiedades cercanas a tu ubicación, debes aceptar compartir tu ubicación en la ventana emergente que verás al ingresar a esta página "}
                      {propLoaded &&
                        !assets.length &&
                        "Aún no hay propiedades, chequea que estes conectado a la red correcta en metamask"}
                      {/* ltn__product-item */}
                      {assets.map((asset) => (
                        <div
                          className="col-xl-6 col-sm-6 col-12"
                          key={asset.tokenId}
                        >
                          <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---">
                            <div className="product-img go-top">
                              <Link to={`/product-details/${asset.tokenId}`}>
                                <img
                                  src={
                                    asset.images !== "" &&
                                    !asset.images[0]
                                      .split("/")
                                      .includes("undefined")
                                      ? asset.images[0]
                                      : publicUrl +
                                        "assets/img/houses/house" +
                                        (asset.tokenId + 1) + //(Math.floor(Math.random() * 5) + 1) +
                                        ".jpg"
                                  }
                                  alt="#"
                                />
                              </Link>
                              <div className="real-estate-agent">
                                <div className="agent-img">
                                  <Link to="/shop">
                                    <img
                                      src={publicUrl + "assets/img/user.webp"}
                                      alt="#"
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="product-info">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <h2 className="product-title go-top">
                                <Link to={`/product-details/${asset.tokenId}`}>
                                  {asset.staticData.title}
                                </Link>
                              </h2>
                              <div className="product-img-location go-top">
                                <ul>
                                  <li>
                                    <Link to="/contact">
                                      <i className="flaticon-pin" />
                                      {asset.staticData.location},{" "}
                                      {asset.ISOCountry}
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                <li>
                                  <span className="ltn__secondary-color"></span>{" "}
                                  {asset.staticData.rooms} Habitaciones
                                </li>
                                <li>
                                  <span> {asset.staticData.size} </span>
                                  m2
                                </li>
                              </ul>
                              <div className="product-hover-action">
                                <ul>
                                  <li>
                                    <a
                                      href="#"
                                      title="Quick View"
                                      data-bs-toggle="modal"
                                      data-bs-target="#quick_view_modal"
                                    >
                                      <i className="flaticon-expand" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#"
                                      title="Wishlist"
                                      data-bs-toggle="modal"
                                      data-bs-target="#liton_wishlist_modal"
                                    >
                                      <i className="flaticon-heart-1" />
                                    </a>
                                  </li>
                                  <li className="go-top">
                                    <Link
                                      to={`/product-details/${asset.tokenId}`}
                                      title="Product Details"
                                    >
                                      <i className="flaticon-add" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="product-info-bottom">
                              <div className="product-price">
                                <span>
                                  U$D {asset.price}
                                  <label>/Mes</label>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* ltn__product-item */}
                      {/* <div className="col-xl-6 col-sm-6 col-12">
                        <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---">
                          <div className="product-img go-top">
                            <Link to="/product-details">
                              <img
                                src={
                                  publicUrl +
                                  "assets/img/houses/house" +
                                  4 +
                                  ".jpg"
                                }
                                alt="#"
                              />
                            </Link>
                            <div className="real-estate-agent">
                              <div className="agent-img">
                                <Link to="/shop">
                                  <img
                                    src={publicUrl + "assets/img/user.webp"}
                                    alt="#"
                                  />
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="product-info">
                            <div className="product-badge">
                              <ul>
                                <li className="sale-badg">Alquiler</li>
                              </ul>
                            </div>
                            <h2 className="product-title go-top">
                              <Link to="/product-details">
                                Apartamento nuevo con hermosa vista
                              </Link>
                            </h2>
                            <div className="product-img-location go-top">
                              <ul>
                                <li>
                                  <Link to="/contact">
                                    <i className="flaticon-pin" /> Belmont
                                    Gardens, Uruguay
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                              <li>
                                <span>3 </span>
                                Camas
                              </li>
                              <li>
                                <span>2 </span>
                                Baños
                              </li>
                              <li>
                                <span>3450 </span>
                                m2
                              </li>
                            </ul>
                            <div className="product-hover-action">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    title="Quick View"
                                    data-bs-toggle="modal"
                                    data-bs-target="#quick_view_modal"
                                  >
                                    <i className="flaticon-expand" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    title="Wishlist"
                                    data-bs-toggle="modal"
                                    data-bs-target="#liton_wishlist_modal"
                                  >
                                    <i className="flaticon-heart-1" />
                                  </a>
                                </li>
                                <li className="go-top">
                                  <Link
                                    to="/product-details"
                                    title="Product Details"
                                  >
                                    <i className="flaticon-add" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="product-info-bottom">
                            <div className="product-price">
                              <span>
                                $34,900<label>/Month</label>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div> */}
                      {/* ltn__product-item */}
                      {/* <div className="col-xl-6 col-sm-6 col-12">
                          <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---">
                            <div className="product-img go-top">
                              <Link to="/product-details">
                                <img
                                  src={publicUrl + "assets/img/product-3/3.jpg"}
                                  alt="#"
                                />
                              </Link>
                              <div className="real-estate-agent">
                                <div className="agent-img">
                                  <Link to="/shop">
                                    <img
                                      src={
                                        publicUrl + "assets/img/blog/author.jpg"
                                      }
                                      alt="#"
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="product-info">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <h2 className="product-title go-top">
                                <Link to="/product-details">
                                  Apartamento nuevo con hermosa vista
                                </Link>
                              </h2>
                              <div className="product-img-location go-top">
                                <ul>
                                  <li>
                                    <Link to="/contact">
                                      <i className="flaticon-pin" /> Belmont
                                      Gardens, Uruguay
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                <li>
                                  <span>3 </span>
                                  Camas
                                </li>
                                <li>
                                  <span>2 </span>
                                  Baños
                                </li>
                                <li>
                                  <span>3450 </span>
                                  m2
                                </li>
                              </ul>
                              <div className="product-hover-action">
                                <ul>
                                  <li>
                                    <a
                                      href="#"
                                      title="Quick View"
                                      data-bs-toggle="modal"
                                      data-bs-target="#quick_view_modal"
                                    >
                                      <i className="flaticon-expand" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#"
                                      title="Wishlist"
                                      data-bs-toggle="modal"
                                      data-bs-target="#liton_wishlist_modal"
                                    >
                                      <i className="flaticon-heart-1" />
                                    </a>
                                  </li>
                                  <li className="go-top">
                                    <Link
                                      to="/product-details"
                                      title="Product Details"
                                    >
                                      <i className="flaticon-add" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="product-info-bottom">
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      {/* ltn__product-item */}
                      {/* <div className="col-xl-6 col-sm-6 col-12">
                          <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---">
                            <div className="product-img go-top">
                              <Link to="/product-details">
                                <img
                                  src={publicUrl + "assets/img/product-3/4.jpg"}
                                  alt="#"
                                />
                              </Link>
                              <div className="real-estate-agent">
                                <div className="agent-img">
                                  <Link to="/shop">
                                    <img
                                      src={
                                        publicUrl + "assets/img/blog/author.jpg"
                                      }
                                      alt="#"
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="product-info">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <h2 className="product-title go-top">
                                <Link to="/product-details">
                                  Apartamento nuevo con hermosa vista
                                </Link>
                              </h2>
                              <div className="product-img-location go-top">
                                <ul>
                                  <li>
                                    <Link to="/contact">
                                      <i className="flaticon-pin" /> Belmont
                                      Gardens, Uruguay
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                <li>
                                  <span>3 </span>
                                  Camas
                                </li>
                                <li>
                                  <span>2 </span>
                                  Baños
                                </li>
                                <li>
                                  <span>3450 </span>
                                  m2
                                </li>
                              </ul>
                              <div className="product-hover-action">
                                <ul>
                                  <li>
                                    <a
                                      href="#"
                                      title="Quick View"
                                      data-bs-toggle="modal"
                                      data-bs-target="#quick_view_modal"
                                    >
                                      <i className="flaticon-expand" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#"
                                      title="Wishlist"
                                      data-bs-toggle="modal"
                                      data-bs-target="#liton_wishlist_modal"
                                    >
                                      <i className="flaticon-heart-1" />
                                    </a>
                                  </li>
                                  <li className="go-top">
                                    <Link
                                      to="/product-details"
                                      title="Product Details"
                                    >
                                      <i className="flaticon-add" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="product-info-bottom">
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      {/* ltn__product-item */}
                      {/* <div className="col-xl-6 col-sm-6 col-12">
                          <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---">
                            <div className="product-img go-top">
                              <Link to="/product-details">
                                <img
                                  src={publicUrl + "assets/img/product-3/5.jpg"}
                                  alt="#"
                                />
                              </Link>
                              <div className="real-estate-agent">
                                <div className="agent-img">
                                  <Link to="/shop">
                                    <img
                                      src={
                                        publicUrl + "assets/img/blog/author.jpg"
                                      }
                                      alt="#"
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="product-info">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <h2 className="product-title go-top">
                                <Link to="/product-details">
                                  Apartamento nuevo con hermosa vista
                                </Link>
                              </h2>
                              <div className="product-img-location go-top">
                                <ul>
                                  <li>
                                    <Link to="/contact">
                                      <i className="flaticon-pin" /> Belmont
                                      Gardens, Uruguay
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                <li>
                                  <span>3 </span>
                                  Camas
                                </li>
                                <li>
                                  <span>2 </span>
                                  Baños
                                </li>
                                <li>
                                  <span>3450 </span>
                                  m2
                                </li>
                              </ul>
                              <div className="product-hover-action">
                                <ul>
                                  <li>
                                    <a
                                      href="#"
                                      title="Quick View"
                                      data-bs-toggle="modal"
                                      data-bs-target="#quick_view_modal"
                                    >
                                      <i className="flaticon-expand" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#"
                                      title="Wishlist"
                                      data-bs-toggle="modal"
                                      data-bs-target="#liton_wishlist_modal"
                                    >
                                      <i className="flaticon-heart-1" />
                                    </a>
                                  </li>
                                  <li className="go-top">
                                    <Link
                                      to="/product-details"
                                      title="Product Details"
                                    >
                                      <i className="flaticon-add" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="product-info-bottom">
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      {/* ltn__product-item */}
                      {/* <div className="col-xl-6 col-sm-6 col-12">
                          <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---">
                            <div className="product-img go-top">
                              <Link to="/product-details">
                                <img
                                  src={publicUrl + "assets/img/product-3/6.jpg"}
                                  alt="#"
                                />
                              </Link>
                              <div className="real-estate-agent">
                                <div className="agent-img">
                                  <Link to="/shop">
                                    <img
                                      src={
                                        publicUrl + "assets/img/blog/author.jpg"
                                      }
                                      alt="#"
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="product-info">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <h2 className="product-title go-top">
                                <Link to="/product-details">
                                  Apartamento nuevo con hermosa vista
                                </Link>
                              </h2>
                              <div className="product-img-location go-top">
                                <ul>
                                  <li>
                                    <Link to="/contact">
                                      <i className="flaticon-pin" /> Belmont
                                      Gardens, Uruguay
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                <li>
                                  <span>3 </span>
                                  Camas
                                </li>
                                <li>
                                  <span>2 </span>
                                  Baños
                                </li>
                                <li>
                                  <span>3450 </span>
                                  m2
                                </li>
                              </ul>
                              <div className="product-hover-action">
                                <ul>
                                  <li>
                                    <a
                                      href="#"
                                      title="Quick View"
                                      data-bs-toggle="modal"
                                      data-bs-target="#quick_view_modal"
                                    >
                                      <i className="flaticon-expand" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#"
                                      title="Wishlist"
                                      data-bs-toggle="modal"
                                      data-bs-target="#liton_wishlist_modal"
                                    >
                                      <i className="flaticon-heart-1" />
                                    </a>
                                  </li>
                                  <li className="go-top">
                                    <Link
                                      to="/product-details"
                                      title="Product Details"
                                    >
                                      <i className="flaticon-add" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="product-info-bottom">
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      {/*  */}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="liton_product_list">
                  <div className="ltn__product-tab-content-inner ltn__product-list-view">
                    <div className="row">
                      <div className="col-lg-12">
                        {/* Search Widget */}
                        <div className="ltn__search-widget mb-30">
                          <form action="#">
                            <input
                              type="text"
                              name="search"
                              placeholder="Filtrar..."
                            />
                            <button type="submit">
                              <i className="fas fa-search" />
                            </button>
                          </form>
                        </div>
                      </div>
                      {/* ltn__product-item */}
                      <div className="col-lg-12">
                        <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5">
                          <div className="product-img go-top">
                            <Link to="/product-details">
                              <img
                                src={publicUrl + "assets/img/product-3/1.jpg"}
                                alt="#"
                              />
                            </Link>
                          </div>
                          <div className="product-info">
                            <div className="product-badge-price">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                            <h2 className="product-title go-top">
                              <Link to="/product-details">
                                Apartamento nuevo con hermosa vista
                              </Link>
                            </h2>
                            <div className="product-img-location go-top">
                              <ul>
                                <li>
                                  <Link to="/contact">
                                    <i className="flaticon-pin" /> Belmont
                                    Gardens, Uruguay
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                              <li>
                                <span>3 </span>
                                Camas
                              </li>
                              <li>
                                <span>2 </span>
                                Baños
                              </li>
                              <li>
                                <span>3450 </span>
                                m2
                              </li>
                            </ul>
                          </div>
                          <div className="product-info-bottom">
                            <div className="real-estate-agent">
                              <div className="agent-img">
                                <Link to="/shop">
                                  <img
                                    src={
                                      publicUrl + "assets/img/blog/author.jpg"
                                    }
                                    alt="#"
                                  />
                                </Link>
                              </div>
                              <div className="agent-brief">
                                <h6>
                                  <Link to="/team-details">William Seklo</Link>
                                </h6>
                                <small>Estate Agents</small>
                              </div>
                            </div>
                            <div className="product-hover-action">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    title="Quick View"
                                    data-bs-toggle="modal"
                                    data-bs-target="#quick_view_modal"
                                  >
                                    <i className="flaticon-expand" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    title="Wishlist"
                                    data-bs-toggle="modal"
                                    data-bs-target="#liton_wishlist_modal"
                                  >
                                    <i className="flaticon-heart-1" />
                                  </a>
                                </li>
                                <li className="go-top">
                                  <Link
                                    to="/product-details"
                                    title="Product Details"
                                  >
                                    <i className="flaticon-add" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ltn__product-item */}
                      <div className="col-lg-12">
                        <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5">
                          <div className="product-img go-top">
                            <Link to="/product-details">
                              <img
                                src={publicUrl + "assets/img/product-3/2.jpg"}
                                alt="#"
                              />
                            </Link>
                          </div>
                          <div className="product-info">
                            <div className="product-badge-price">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                            <h2 className="product-title go-top">
                              <Link to="/product-details">
                                Apartamento nuevo con hermosa vista
                              </Link>
                            </h2>
                            <div className="product-img-location go-top">
                              <ul>
                                <li>
                                  <Link to="/contact">
                                    <i className="flaticon-pin" /> Belmont
                                    Gardens, Uruguay
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                              <li>
                                <span>3 </span>
                                Camas
                              </li>
                              <li>
                                <span>2 </span>
                                Baños
                              </li>
                              <li>
                                <span>3450 </span>
                                m2
                              </li>
                            </ul>
                          </div>
                          <div className="product-info-bottom">
                            <div className="real-estate-agent">
                              <div className="agent-img">
                                <Link to="/shop">
                                  <img
                                    src={
                                      publicUrl + "assets/img/blog/author.jpg"
                                    }
                                    alt="#"
                                  />
                                </Link>
                              </div>
                              <div className="agent-brief">
                                <h6>
                                  <Link to="/team-details">William Seklo</Link>
                                </h6>
                                <small>Estate Agents</small>
                              </div>
                            </div>
                            <div className="product-hover-action">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    title="Quick View"
                                    data-bs-toggle="modal"
                                    data-bs-target="#quick_view_modal"
                                  >
                                    <i className="flaticon-expand" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    title="Wishlist"
                                    data-bs-toggle="modal"
                                    data-bs-target="#liton_wishlist_modal"
                                  >
                                    <i className="flaticon-heart-1" />
                                  </a>
                                </li>
                                <li className="go-top">
                                  <Link
                                    to="/product-details"
                                    title="Product Details"
                                  >
                                    <i className="flaticon-add" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ltn__product-item */}
                      <div className="col-lg-12">
                        <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5">
                          <div className="product-img go-top">
                            <Link to="/product-details">
                              <img
                                src={publicUrl + "assets/img/product-3/3.jpg"}
                                alt="#"
                              />
                            </Link>
                          </div>
                          <div className="product-info">
                            <div className="product-badge-price">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                            <h2 className="product-title go-top">
                              <Link to="/product-details">
                                Apartamento nuevo con hermosa vista
                              </Link>
                            </h2>
                            <div className="product-img-location go-top">
                              <ul>
                                <li>
                                  <Link to="/contact">
                                    <i className="flaticon-pin" /> Belmont
                                    Gardens, Uruguay
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                              <li>
                                <span>3 </span>
                                Camas
                              </li>
                              <li>
                                <span>2 </span>
                                Baños
                              </li>
                              <li>
                                <span>3450 </span>
                                m2
                              </li>
                            </ul>
                          </div>
                          <div className="product-info-bottom">
                            <div className="real-estate-agent">
                              <div className="agent-img">
                                <Link to="/shop">
                                  <img
                                    src={
                                      publicUrl + "assets/img/blog/author.jpg"
                                    }
                                    alt="#"
                                  />
                                </Link>
                              </div>
                              <div className="agent-brief">
                                <h6>
                                  <Link to="/team-details">William Seklo</Link>
                                </h6>
                                <small>Estate Agents</small>
                              </div>
                            </div>
                            <div className="product-hover-action">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    title="Quick View"
                                    data-bs-toggle="modal"
                                    data-bs-target="#quick_view_modal"
                                  >
                                    <i className="flaticon-expand" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    title="Wishlist"
                                    data-bs-toggle="modal"
                                    data-bs-target="#liton_wishlist_modal"
                                  >
                                    <i className="flaticon-heart-1" />
                                  </a>
                                </li>
                                <li className="go-top">
                                  <Link
                                    to="/product-details"
                                    title="Product Details"
                                  >
                                    <i className="flaticon-add" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ltn__product-item */}
                      <div className="col-lg-12">
                        <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5">
                          <div className="product-img go-top">
                            <Link to="/product-details">
                              <img
                                src={publicUrl + "assets/img/product-3/4.jpg"}
                                alt="#"
                              />
                            </Link>
                          </div>
                          <div className="product-info">
                            <div className="product-badge-price">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                            <h2 className="product-title go-top">
                              <Link to="/product-details">
                                Apartamento nuevo con hermosa vista
                              </Link>
                            </h2>
                            <div className="product-img-location go-top">
                              <ul>
                                <li>
                                  <Link to="/contact">
                                    <i className="flaticon-pin" /> Belmont
                                    Gardens, Uruguay
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                              <li>
                                <span>3 </span>
                                Camas
                              </li>
                              <li>
                                <span>2 </span>
                                Baños
                              </li>
                              <li>
                                <span>3450 </span>
                                m2
                              </li>
                            </ul>
                          </div>
                          <div className="product-info-bottom">
                            <div className="real-estate-agent">
                              <div className="agent-img">
                                <Link to="/shop">
                                  <img
                                    src={
                                      publicUrl + "assets/img/blog/author.jpg"
                                    }
                                    alt="#"
                                  />
                                </Link>
                              </div>
                              <div className="agent-brief">
                                <h6>
                                  <Link to="/team-details">William Seklo</Link>
                                </h6>
                                <small>Estate Agents</small>
                              </div>
                            </div>
                            <div className="product-hover-action">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    title="Quick View"
                                    data-bs-toggle="modal"
                                    data-bs-target="#quick_view_modal"
                                  >
                                    <i className="flaticon-expand" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    title="Wishlist"
                                    data-bs-toggle="modal"
                                    data-bs-target="#liton_wishlist_modal"
                                  >
                                    <i className="flaticon-heart-1" />
                                  </a>
                                </li>
                                <li className="go-top">
                                  <Link
                                    to="/product-details"
                                    title="Product Details"
                                  >
                                    <i className="flaticon-add" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ltn__product-item */}
                      <div className="col-lg-12">
                        <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5">
                          <div className="product-img go-top">
                            <Link to="/product-details">
                              <img
                                src={publicUrl + "assets/img/product-3/5.jpg"}
                                alt="#"
                              />
                            </Link>
                          </div>
                          <div className="product-info">
                            <div className="product-badge-price">
                              <div className="product-badge">
                                <ul>
                                  <li className="sale-badg">Alquiler</li>
                                </ul>
                              </div>
                              <div className="product-price">
                                <span>
                                  $34,900<label>/Month</label>
                                </span>
                              </div>
                            </div>
                            <h2 className="product-title go-top">
                              <Link to="/product-details">
                                Apartamento nuevo con hermosa vista
                              </Link>
                            </h2>
                            <div className="product-img-location go-top">
                              <ul>
                                <li>
                                  <Link to="/contact">
                                    <i className="flaticon-pin" /> Belmont
                                    Gardens, Uruguay
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                              <li>
                                <span>3 </span>
                                Camas
                              </li>
                              <li>
                                <span>2 </span>
                                Baños
                              </li>
                              <li>
                                <span>3450 </span>
                                m2
                              </li>
                            </ul>
                          </div>
                          <div className="product-info-bottom">
                            <div className="real-estate-agent">
                              <div className="agent-img">
                                <Link to="/shop">
                                  <img
                                    src={
                                      publicUrl + "assets/img/blog/author.jpg"
                                    }
                                    alt="#"
                                  />
                                </Link>
                              </div>
                              <div className="agent-brief">
                                <h6>
                                  <Link to="/team-details">William Seklo</Link>
                                </h6>
                                <small>Estate Agents</small>
                              </div>
                            </div>
                            <div className="product-hover-action">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    title="Quick View"
                                    data-bs-toggle="modal"
                                    data-bs-target="#quick_view_modal"
                                  >
                                    <i className="flaticon-expand" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    title="Wishlist"
                                    data-bs-toggle="modal"
                                    data-bs-target="#liton_wishlist_modal"
                                  >
                                    <i className="flaticon-heart-1" />
                                  </a>
                                </li>
                                <li className="go-top">
                                  <Link
                                    to="/product-details"
                                    title="Product Details"
                                  >
                                    <i className="flaticon-add" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/*  */}
                    </div>
                  </div>
                </div>
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
            <Sidebar
              filterByCategory={filterByCategory}
              setFilterByCategory={setFilterByCategory}
              setAssets={setAssets}
            />
          </div>
        </div>
      </div>

      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="liton_wishlist_modal" tabIndex={-1}>
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="ltn__quick-view-modal-inner">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-12">
                        <div className="modal-product-img">
                          <img
                            src={publicUrl + "assets/img/product/7.png"}
                            alt="#"
                          />
                        </div>
                        <div className="modal-product-info go-top">
                          <h5>
                            <Link to="/product-details">
                              Brake Conversion Kit
                            </Link>
                          </h5>
                          <p className="added-cart">
                            <i className="fa fa-check-circle" /> Successfully
                            added to your Wishlist
                          </p>
                          <div className="btn-wrapper">
                            <Link
                              to="/wishlist"
                              className="theme-btn-1 btn btn-effect-1"
                            >
                              View Wishlist
                            </Link>
                          </div>
                        </div>
                        {/* additional-info */}
                        <div className="additional-info d-none">
                          <p>
                            We want to give you <b>10% discount</b> for your
                            first order, <br /> Use discount code at checkout
                          </p>
                          <div className="payment-method">
                            <img
                              src={publicUrl + "assets/img/icons/payment.png"}
                              alt="#"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ltn__modal-area ltn__quick-view-modal-area">
        <div className="modal fade" id="quick_view_modal" tabIndex={-1}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                  {/* <i class="fas fa-times"></i> */}
                </button>
              </div>
              <div className="modal-body">
                <div className="ltn__quick-view-modal-inner">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="modal-product-img">
                          <img
                            src={publicUrl + "assets/img/product/4.png"}
                            alt="#"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="modal-product-info">
                          <div className="product-ratting">
                            <ul>
                              <li>
                                <a href="#">
                                  <i className="fas fa-star" />
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fas fa-star" />
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fas fa-star" />
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fas fa-star-half-alt" />
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="far fa-star" />
                                </a>
                              </li>
                              <li className="review-total">
                                {" "}
                                <a href="#"> ( 95 Reviews )</a>
                              </li>
                            </ul>
                          </div>
                          <h3>Brake Conversion Kit</h3>
                          <div className="product-price">
                            <span>$149.00</span>
                            <del>$165.00</del>
                          </div>
                          <div className="modal-product-meta ltn__product-details-menu-1">
                            <ul>
                              <li>
                                <strong>Categories:</strong>
                                <span className="go-top">
                                  <Link to="/blog">Parts</Link>
                                  <Link to="/blog">Car</Link>
                                  <Link to="/blog">Seat</Link>
                                  <Link to="/blog">Cover</Link>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="ltn__product-details-menu-2">
                            <ul>
                              <li>
                                <div className="cart-plus-minus">
                                  <input
                                    type="text"
                                    defaultValue="02"
                                    name="qtybutton"
                                    className="cart-plus-minus-box"
                                  />
                                </div>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  className="theme-btn-1 btn btn-effect-1"
                                  title="Add to Cart"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add_to_cart_modal"
                                >
                                  <i className="fas fa-shopping-cart" />
                                  <span>ADD TO CART</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                          <hr />
                          <div className="ltn__social-media">
                            <ul>
                              <li>Share:</li>
                              <li>
                                <a
                                  href="https://www.facebook.com/BonvoMx"
                                  title="Facebook"
                                >
                                  <i className="fab fa-facebook-f" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://twitter.com/BonvoOficial"
                                  title="Twitter"
                                >
                                  <i className="fab fa-twitter" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://www.instagram.com/bonvo_oficial/"
                                  title="Instagram"
                                >
                                  <i className="fab fa-instagram" />
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="add_to_cart_modal" tabIndex={-1}>
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="ltn__quick-view-modal-inner">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-12">
                        <div className="modal-product-img">
                          <img
                            src={publicUrl + "assets/img/product/1.png"}
                            alt="#"
                          />
                        </div>
                        <div className="modal-product-info go-top">
                          <h5 className="go-top">
                            <Link to="/product-details">
                              Brake Conversion Kit
                            </Link>
                          </h5>
                          <p className="added-cart">
                            <i className="fa fa-check-circle" />
                            Successfully added to your Cart
                          </p>
                          <div className="btn-wrapper">
                            <Link
                              to="/cart"
                              className="theme-btn-1 btn btn-effect-1"
                            >
                              View Cart
                            </Link>
                            <Link
                              to="/checkout"
                              className="theme-btn-2 btn btn-effect-2"
                            >
                              Checkout
                            </Link>
                          </div>
                        </div>
                        {/* additional-info */}
                        <div className="additional-info d-none">
                          <p>
                            We want to give you <b>10% discount</b> for your
                            first order, <br /> Use discount code at checkout
                          </p>
                          <div className="payment-method">
                            <img
                              src={publicUrl + "assets/img/icons/payment.png"}
                              alt="#"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopGridV1;
