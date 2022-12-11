import React, { Component } from "react";
import { Link } from "react-router-dom";

class WishList extends Component {
  render() {
    let publicUrl = process.env.PUBLIC_URL + "/";

    return (
      <div className="liton__wishlist-area mb-105">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="shoping-cart-inner">
                <div className="shoping-cart-table table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="cart-product-remove">x</td>
                        <td className="cart-product-image">
                          <Link to="/product-details/">
                            <img
                              src={publicUrl + "assets/img/houses/house1.jpg"}
                              alt="#"
                            />
                          </Link>
                        </td>
                        <td className="cart-product-info">
                          <h4 className="go-top">
                            <Link to="/product-details/">Casa moderna</Link>
                          </h4>
                        </td>
                        <td className="cart-product-price">$85.000</td>
                        <td className="cart-product-stock">Dejar reseña</td>
                      </tr>
                      <tr>
                        <td className="cart-product-remove">x</td>
                        <td className="cart-product-image">
                          <Link to="/product-details/">
                            <img
                              src={publicUrl + "assets/img/houses/house2.jpg"}
                              alt="#"
                            />
                          </Link>
                        </td>
                        <td className="cart-product-info">
                          <h4 className="go-top">
                            <Link to="/product-details/">Casa vintage</Link>
                          </h4>
                        </td>
                        <td className="cart-product-price">$89.000</td>
                        <td className="cart-product-stock">Dejar reseña</td>
                      </tr>
                      <tr>
                        <td className="cart-product-remove">x</td>
                        <td className="cart-product-image">
                          <Link to="/product-details/">
                            <img
                              src={publicUrl + "assets/img/houses/house3.jpg"}
                              alt="#"
                            />
                          </Link>
                        </td>
                        <td className="cart-product-info">
                          <h4 className="go-top">
                            <Link to="/product-details/">Casa de playa</Link>
                          </h4>
                        </td>
                        <td className="cart-product-price">$149.000</td>
                        <td className="cart-product-stock">Dejar reseña</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WishList;
