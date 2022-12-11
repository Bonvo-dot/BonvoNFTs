import { BigNumber, ethers, utils } from "ethers";
import React, { useEffect, useContext, useState } from "react";
import ContextWeb3 from "./ContextWeb3";
import ContractABI from "../abi/ContractABI.json";
import { contractAddress } from "./AddPropertyForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessageToast from "./MessageToast";

const ModalReview = (props) => {
  const { state } = useContext(ContextWeb3);

  let publicUrl = process.env.PUBLIC_URL + "/";

  const [review, setReview] = useState({
    rate: 0,
    argue: "",
  });
  const [star, setStar] = useState({
    star1: "far fa-star",
    star2: "far fa-star",
    star3: "far fa-star",
    star4: "far fa-star",
    star5: "far fa-star",
  });

  const handleChange = (e) => {
    if (e.target.name === "rate") {
      setReview({
        ...review,
        [e.target.name]: parseInt(e.target.value),
      });
    } else {
      setReview({
        ...review,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleRate = (num) => {
    switch (num) {
      case 1:
        setStar({
          star1: "fas fa-star",
          star2: "far fa-star",
          star3: "far fa-star",
          star4: "far fa-star",
          star5: "far fa-star",
        });
        break;
      case 2:
        setStar({
          star1: "fas fa-star",
          star2: "fas fa-star",
          star3: "far fa-star",
          star4: "far fa-star",
          star5: "far fa-star",
        });
        break;
      case 3:
        setStar({
          star1: "fas fa-star",
          star2: "fas fa-star",
          star3: "fas fa-star",
          star4: "far fa-star",
          star5: "far fa-star",
        });
        break;
      case 4:
        setStar({
          star1: "fas fa-star",
          star2: "fas fa-star",
          star3: "fas fa-star",
          star4: "fas fa-star",
          star5: "far fa-star",
        });
        break;
      case 5:
        setStar({
          star1: "fas fa-star",
          star2: "fas fa-star",
          star3: "fas fa-star",
          star4: "fas fa-star",
          star5: "fas fa-star",
        });
        break;
      default:
        setStar({
          star1: "far fa-star",
          star2: "far fa-star",
          star3: "far fa-star",
          star4: "far fa-star",
          star5: "far fa-star",
        });
    }

    setReview({
      ...review,
      rate: parseInt(num),
    });
  };

  const handleSubmit = async (e) => {
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

    if (review.rate === 0 && review.argue === "") {
      toast.update(id, {
        render: "Por favor, califica la propiedad",
        type: "error",
        isLoading: false,
      });
      return;
    }
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
          .addRate(review.rate, review.argue, props.assetId)
          .then((tx) => {
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
      console.log(error);
      toast.update(id, {
        render: "Algo salió mal",
        type: "error",
        isLoading: false,
      });
    }
  };

  return (
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
              </button>
            </div>
            <div className="modal-body">
              <div className="ltn__quick-view-modal-inner">
                <div className="modal-product-item">
                  <div className="row">
                    {/* <div
                      className="col-lg-4 col-12"
                      style={{ display: "flex" }}
                    >
                      <div className="modal-product-img">
                        <img
                          src={
                            publicUrl +
                            "assets/img/vu-anh-TiVPTYCG_3E-unsplash_11zon.webp"
                          }
                          alt="#"
                        />
                      </div>
                    </div> */}
                    <div className="col-lg-12 col-12">
                      <div className="modal-product-info">
                        <h3>Agregar Reseña</h3>
                        <div className="ltn__form-box contact-form-box box-shadow white-bg">
                          <h4 className="title-2">Describe tu experiencia</h4>
                          <form onSubmit={handleSubmit}>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <textarea
                                    name="argue"
                                    placeholder="Reseña"
                                    onChange={handleChange}
                                    defaultValue={""}
                                  />
                                </div>
                              </div>
                              <div className="product-ratting">
                                <ul
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <li>
                                    <i
                                      className={star.star1}
                                      onClick={() => handleRate(1)}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "2em",
                                      }}
                                    />
                                  </li>
                                  <li>
                                    <i
                                      className={star.star2}
                                      onClick={() => handleRate(2)}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "2em",
                                      }}
                                    />
                                  </li>
                                  <li>
                                    <i
                                      className={star.star3}
                                      onClick={() => handleRate(3)}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "2em",
                                      }}
                                    />
                                  </li>
                                  <li>
                                    <i
                                      className={star.star4}
                                      onClick={() => handleRate(4)}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "2em",
                                      }}
                                    />
                                  </li>
                                  <li>
                                    <i
                                      className={star.star5}
                                      onClick={() => handleRate(5)}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "2em",
                                      }}
                                    />
                                  </li>
                                  <li
                                    className="review-total"
                                    style={{
                                      fontSize: "1.5em",
                                    }}
                                  >
                                    {review.rate} / 5
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="btn-wrapper mt-0">
                              <button
                                className="btn theme-btn-1 btn-effect-1 text-uppercase"
                                type="submit"
                              >
                                Enviar Reseña
                              </button>
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
                            <p className="form-messege mb-0 mt-20" />
                          </form>
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

export default ModalReview;
