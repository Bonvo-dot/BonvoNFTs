import { ethers, utils } from "ethers";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { contractAddress } from "../../moonbeam/AddPropertyForm";
import ContextWeb3 from "../../moonbeam/ContextWeb3";
import ContractABI from "../../abi/ContractABI.json";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessageToast from "../../moonbeam/MessageToast";

const ShopDetails = () => {
  let publicUrl = process.env.PUBLIC_URL + "/";
  const { state } = useContext(ContextWeb3);
  const location = useLocation();
  const assetId = Number(location.pathname.split("/")[2]);

  const [hasRentByAddress, setHasRentByAddress] = useState(false);
  const [owner, setOwner] = useState(false);

  // useEffect(()=>{
  //   const fetchMyRents = async () => {
  //     if (state.address && asset.staticData.title === "") {
  //       try {
  //         const { ethereum } = window;
  //         if (ethereum) {
  //           const provider = new ethers.providers.Web3Provider(ethereum);
  //           const signer = provider.getSigner(state.address);
  //           const contract = new ethers.Contract(
  //             contractAddress,
  //             ContractABI,
  //             signer
  //           );
  //           await contract
  //             .assetsByTokenId(assetId)
  //             .then(async (tx) => {
  //               console.log(tx);
  //               const txAsset = {
  //                 timestamp: new Date(
  //                   tx.timestamp.toNumber()
  //                 ).toLocaleDateString(),
  //                 tokenId: tx.tokenId.toNumber(),
  //                 price: tx.price.toNumber(),
  //                 idCategory: tx.idCategory,
  //                 ISOCountry: tx.ISOCountry,
  //                 owner: tx.owner,
  //                 staticData: {
  //                   title: tx.staticData.title,
  //                   description: tx.staticData.description,
  //                   rooms: tx.staticData.rooms.toNumber(),
  //                   location: tx.staticData.location,
  //                   size: tx.staticData.size.toNumber(),
  //                 },
  //               };
  //               setAsset(txAsset);
  //               await contract.getAssetRates(assetId).then((tx) => {
  //                 console.log("reviews", tx);
  //                 setReview(tx);
  //               });
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //             });
  //         }
  //       } catch (error) {
  //         console.log("error", error);
  //       }
  //     }
  //   };
  //   fetchMyRents();
  // })

  const [reviews, setReview] = useState([]);

  const [asset, setAsset] = useState({
    timestamp: "",
    tokenId: "",
    owner: "",
    price: "", //uint
    images: "",
    latitude: "", //int
    longitude: "", //int
    idCategory: "", //uint
    ISOCountry: "",
    staticData: {
      title: "",
      description: "",
      location: "",
      rooms: "", //uint
      size: "", //uint8
    },
  });

  /* Fecth Asset by id */
  useEffect(() => {
    const fetchAsset = async () => {
      if (state.address && asset.staticData.title === "") {
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
            await contract
              .assetsByTokenId(assetId)
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
                };
                setAsset(txAsset);
                await contract.getAssetRates(assetId).then((tx) => {
                  console.log("reviews", tx);
                  setReview(tx);
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };
    fetchAsset();
    if (
      state.address &&
      asset.owner !== "" &&
      utils.getAddress(state.address) === utils.getAddress(asset.owner)
    ) {
      setOwner(true);
    }
  }, [state, assetId, asset]);

  const handleRent = async (e) => {
    e.preventDefault();
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
        console.log(contract);
        console.log(assetId);
        await contract
          .addRent(assetId)
          .then((tx) => {
            console.log(tx);
            toast.update(id, {
              render: `
              Transacción realizada correctamente! 🎉
              `,
              type: "success",
              isLoading: false,
              autoClose: 5000,
            });
            toast(<MessageToast txHash={tx.hash} />, {
              autoClose: 5000,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log("error", error);
      toast.update(id, {
        render: "Algo salió mal",
        type: "error",
        isLoading: false,
      });
    }
  };
  return (
    <div className="ltn__shop-details-area pb-10">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
              <div className="ltn__blog-meta">
                <ul>
                  <li className="ltn__blog-category">
                    <Link to="#">Destacado</Link>
                  </li>
                  <li className="ltn__blog-category">
                    <Link className="bg-orange" to="#">
                      Alquiler
                    </Link>
                  </li>
                  <li className="ltn__blog-date">
                    <i className="far fa-calendar-alt" />
                    {asset.timestamp}
                  </li>
                  <li>
                    <Link to="#">
                      <i className="far fa-comments" />
                      35 Commentarios
                    </Link>
                  </li>
                </ul>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h1 style={{ marginTop: "15px" }}>{asset.staticData.title}</h1>
                {!owner && (
                  <button
                    className="btn theme-btn-1 btn-effect-1 text-uppercase"
                    onClick={handleRent}
                  >
                    Rentar
                  </button>
                )}
              </div>
              <label>
                <span className="ltn__secondary-color">
                  <i className="flaticon-pin" />
                </span>{" "}
                {asset.staticData.location}, {asset.ISOCountry}
              </label>
              <label style={{ marginLeft: "1rem" }}>
                <span className="ltn__secondary-color">
                  {asset.staticData.rooms}
                </span>{" "}
                Habitaciones
              </label>
              <label style={{ marginLeft: "1rem" }}>
                <span className="ltn__secondary-color">
                  {asset.staticData.size}
                </span>{" "}
                m2
              </label>
              <h4 className="title-2">Descripción</h4>
              <p>{asset.staticData.description}</p>
            </div>
          </div>
          <div className="col-lg-4">
            <aside className="sidebar ltn__shop-sidebar ltn__right-sidebar---">
              {/* Author Widget */}
              <div className="widget ltn__author-widget">
                <div className="ltn__author-widget-inner text-center">
                  <img
                    src={
                      publicUrl +
                      "assets/img/gallery/vendedora_inmobiliaria.jpg"
                    }
                    alt="Imagen"
                  />
                  <h5>Rosalina D. Willaimson</h5>
                  <small>Agente inmobiliario</small>
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
                        <a href="#"> ( 1 Reviews )</a>
                      </li>
                    </ul>
                  </div>
                  <p>Vendedora hace 15 años en la plataforma Bonvo.</p>
                  <div className="ltn__social-media">
                    <ul>
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
                        <a href="#" title="Youtube">
                          <i className="fab fa-youtube" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          <div className="col-lg-12">
            <h4 className="title-2">Ubicación</h4>
            <div className="property-details-google-map mb-60">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9334.271551495209!2d-73.97198251485975!3d40.668170674982946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b0456b5a2e7%3A0x68bdf865dda0b669!2sBrooklyn%20Botanic%20Garden%20Shop!5e0!3m2!1sen!2sbd!4v1590597267201!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                frameBorder={0}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
                title="map"
              />
            </div>
            <div className="ltn__shop-details-tab-content-inner--- ltn__shop-details-tab-inner-2 ltn__product-details-review-inner mb-60">
              <h4 className="title-2">Reseñas</h4>
              <div className="product-ratting general">
                <ul>
                  <li>
                    <i className="fas fa-star" />
                  </li>
                  <li>
                    <i className="fas fa-star" />
                  </li>
                  <li>
                    <i className="fas fa-star" />
                  </li>
                  <li>
                    <i className="fas fa-star-half-alt" />
                  </li>
                  <li>
                    <i className="far fa-star" />
                  </li>
                  <li className="review-total">{reviews.length} Reseñas </li>
                </ul>
              </div>
              <hr />
              {/* comment-area */}
              {reviews.map((review, idx) => (
                <div className="ltn__comment-area mb-30" key={idx}>
                  <div className="ltn__comment-inner">
                    <ul>
                      <li>
                        <div className="ltn__comment-item clearfix">
                          <div className="ltn__commenter-img">
                            <img
                              src={publicUrl + "assets/img/user.webp"}
                              alt="Imagen"
                            />
                          </div>
                          <div className="ltn__commenter-comment">
                            <h6>
                              <a href="#">{review.rater.slice(0, 10)}...</a>
                            </h6>

                            <div className="product-ratting">
                              {review.rate === 1 && (
                                <ul
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                </ul>
                              )}
                              {review.rate === 2 && (
                                <ul
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                </ul>
                              )}
                              {review.rate === 3 && (
                                <ul
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                </ul>
                              )}
                              {review.rate === 4 && (
                                <ul
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="far fa-star" />
                                  </li>
                                </ul>
                              )}
                              {review.rate === 5 && (
                                <ul
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                  <li>
                                    <i className="fas fa-star" />
                                  </li>
                                </ul>
                              )}
                            </div>
                            <p>{review.argue}</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default ShopDetails;
