import React, { Component } from "react";
import { Link } from "react-router-dom";
import ConnectWallet from "../../moonbeam/ConnectWallet";
import Social from "../section-components/social";

class Navbar extends Component {
  render() {
    let publicUrl = process.env.PUBLIC_URL + "/";
    return (
      <div>
        <header className="ltn__header-area ltn__header-5 ltn__header-transparent--- gradient-color-4---">
          <div className="ltn__header-top-area section-bg-6 top-area-color-white---">
            <div className="container">
              <div className="row">
                <div className="col-md-7">
                  <div className="ltn__top-bar-menu">
                    <ul>
                      <li>
                        <a href="mailto:info@webmail.com?Subject=Flower%20greetings%20to%20you">
                          <i className="icon-mail" />
                          bonvo.oficial@gmail.com
                        </a>
                      </li>
                      <li>
                        <a href="locations.html">
                          <i className="icon-placeholder" /> Argentina, Bolivia,
                          Mexico, Uruguay
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="top-bar-right text-end">
                    <div className="ltn__top-bar-menu">
                      <ul>
                        <li>
                          <Social />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white">
            <div className="container">
              <div className="row">
                <div className="col">
                  <div className="site-logo-wrap">
                    <div className="site-logo go-top">
                      <Link to="/">
                        <img
                          src={publicUrl + "assets/img/logo_floating.png"}
                          alt="Logo"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col header-menu-column">
                  <div className="header-menu d-none d-xl-block">
                    <nav>
                      <div className="ltn__main-menu go-top">
                        <ul>
                          <li>
                            <Link to="/about">Nosotros</Link>
                          </li>
                          <li>
                            <Link to="/shop">Propiedades</Link>
                          </li>
                          <li>
                            <Link to="/contact">Contacto</Link>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="col ltn__header-options ltn__header-options-2 mb-sm-20">
                  {/* user-menu */}
                  <div className="ltn__drop-menu user-menu">
                    <ConnectWallet />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div
          id="ltn__utilize-mobile-menu"
          className="ltn__utilize ltn__utilize-mobile-menu"
        >
          <div className="ltn__utilize-menu-inner ltn__scrollbar">
            <div className="ltn__utilize-menu-head">
              <div className="site-logo">
                <Link to="/">
                  <img
                    src={publicUrl + "assets/img/logo_floating.png"}
                    alt="Logo"
                  />
                </Link>
              </div>
              <button className="ltn__utilize-close">×</button>
            </div>
            <div className="ltn__utilize-menu-search-form">
              <form action={"#"}>
                <input type="text" placeholder="Search..." />
                <button>
                  <i className="fas fa-search" />
                </button>
              </form>
            </div>
            <div className="ltn__utilize-menu">
              <ul>
                <li>
                  <a href="#">Home</a>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/">Home Style 01</Link>
                    </li>
                    <li>
                      <Link to="/home-v2">Home Style 02</Link>
                    </li>
                    <li>
                      <Link to="/home-v3">Home Style 03</Link>
                    </li>
                    <li>
                      <Link to="/home-v4">Home Style 04</Link>
                    </li>
                    <li>
                      <Link to="/home-v5">
                        Home Style 05{" "}
                        <span className="menu-item-badge">video</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/home-v6">Home Style 06</Link>
                    </li>
                    <li>
                      <Link to="/home-v7">Home Style 07</Link>
                    </li>
                    <li>
                      <Link to="/home-v8">Home Style 08</Link>
                    </li>
                    <li>
                      <Link to="/home-v9">Home Style 09</Link>
                    </li>
                    <li>
                      <Link to="/home-v10">Home Style 10</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/about">About</Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link to="/service">Services</Link>
                    </li>
                    <li>
                      <Link to="/service-details">Service Details</Link>
                    </li>
                    <li>
                      <Link to="/portfolio">Portfolio</Link>
                    </li>
                    <li>
                      <Link to="/portfolio-v2">Portfolio - 02</Link>
                    </li>
                    <li>
                      <Link to="/portfolio-details">Portfolio Details</Link>
                    </li>
                    <li>
                      <Link to="/team">Team</Link>
                    </li>
                    <li>
                      <Link to="/team-details">Team Details</Link>
                    </li>
                    <li>
                      <Link to="/faq">FAQ</Link>
                    </li>
                    <li>
                      <Link to="/location">Google Map Locations</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/shop">Shop</Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/shop">Shop</Link>
                    </li>
                    <li>
                      <Link to="/shop-grid">Shop Grid</Link>
                    </li>
                    <li>
                      <Link to="/shop-left-sidebar">Shop Left sidebar</Link>
                    </li>
                    <li>
                      <Link to="/shop-right-sidebar">Shop Right sidebar</Link>
                    </li>
                    <li>
                      <Link to="/product-details">Shop Details</Link>
                    </li>
                    <li>
                      <Link to="/cart">Cart</Link>
                    </li>
                    <li>
                      <Link to="/checkout">Checkout</Link>
                    </li>
                    <li>
                      <Link to="/my-account">My Account</Link>
                    </li>
                    <li>
                      <Link to="/login">Sign in</Link>
                    </li>
                    <li>
                      <Link to="/register">Register</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/blog-grid">News</Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/blog">News</Link>
                    </li>
                    <li>
                      <Link to="/blog-grid">News Grid</Link>
                    </li>
                    <li>
                      <Link to="/blog-left-sidebar">News Left sidebar</Link>
                    </li>
                    <li>
                      <Link to="/blog-right-sidebar">News Right sidebar</Link>
                    </li>
                    <li>
                      <Link to="/blog-details">News details</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="#">Pages</Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link to="/service">Services</Link>
                    </li>
                    <li>
                      <Link to="/service-details">Service Details</Link>
                    </li>
                    <li>
                      <Link to="/portfolio">Portfolio</Link>
                    </li>
                    <li>
                      <Link to="/portfolio-2">Portfolio - 02</Link>
                    </li>
                    <li>
                      <Link to="/portfolio-details">Portfolio Details</Link>
                    </li>
                    <li>
                      <Link to="/team">Team</Link>
                    </li>
                    <li>
                      <Link to="/team-details">Team Details</Link>
                    </li>
                    <li>
                      <Link to="/faq">FAQ</Link>
                    </li>
                    <li>
                      <Link to="/history">History</Link>
                    </li>
                    <li>
                      <Link to="/add-listing">Add Listing</Link>
                    </li>
                    <li>
                      <Link to="/locations">Google Map Locations</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contacto</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/contact">Contacto</Link>
                </li>
              </ul>
            </div>
            <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
              <ul>
                <li>
                  <Link to="/my-account" title="My Account">
                    <span className="utilize-btn-icon">
                      <i className="far fa-user" />
                    </span>
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" title="Wishlist">
                    <span className="utilize-btn-icon">
                      <i className="far fa-heart" />
                      <sup>3</sup>
                    </span>
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/cart" title="Shoping Cart">
                    <span className="utilize-btn-icon">
                      <i className="fas fa-shopping-cart" />
                      <sup>5</sup>
                    </span>
                    Shoping Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div className="ltn__social-media-2">
              <ul>
                <li>
                  <a href="https://www.facebook.com/BonvoMx" title="Facebook">
                    <i className="fab fa-facebook-f" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/BonvoOficial" title="Twitter">
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
        {/* Utilize Cart Menu Start */}
        <div
          id="ltn__utilize-cart-menu"
          className="ltn__utilize ltn__utilize-cart-menu"
        >
          <div className="ltn__utilize-menu-inner ltn__scrollbar">
            <div className="ltn__utilize-menu-head">
              <span className="ltn__utilize-menu-title">Cart</span>
              <button className="ltn__utilize-close">×</button>
            </div>
            <div className="mini-cart-product-area ltn__scrollbar">
              <div className="mini-cart-item clearfix">
                <div className="mini-cart-img go-top">
                  <Link to="/product-details">
                    <img
                      src={publicUrl + "assets/img/product/1.png"}
                      alt="Imagen"
                    />
                  </Link>
                  <span className="mini-cart-item-delete">
                    <i className="icon-cancel" />
                  </span>
                </div>
                <div className="mini-cart-info go-top">
                  <h6>
                    <Link to="/product-details">Wheel Bearing Retainer</Link>
                  </h6>
                  <span className="mini-cart-quantity">1 x $65.00</span>
                </div>
              </div>
              <div className="mini-cart-item clearfix">
                <div className="mini-cart-img go-top">
                  <Link to="/product-details">
                    <img
                      src={publicUrl + "assets/img/product/2.png"}
                      alt="Imagen"
                    />
                  </Link>
                  <span className="mini-cart-item-delete">
                    <i className="icon-cancel" />
                  </span>
                </div>
                <div className="mini-cart-info go-top">
                  <h6>
                    <Link to="/product-details">Brake Conversion Kit</Link>
                  </h6>
                  <span className="mini-cart-quantity">1 x $85.00</span>
                </div>
              </div>
              <div className="mini-cart-item clearfix">
                <div className="mini-cart-img go-top">
                  <Link to="/product-details">
                    <img
                      src={publicUrl + "assets/img/product/3.png"}
                      alt="Imagen"
                    />
                  </Link>
                  <span className="mini-cart-item-delete">
                    <i className="icon-cancel" />
                  </span>
                </div>
                <div className="mini-cart-info go-top">
                  <h6>
                    <Link to="/product-details">OE Replica Wheels</Link>
                  </h6>
                  <span className="mini-cart-quantity">1 x $92.00</span>
                </div>
              </div>
              <div className="mini-cart-item clearfix">
                <div className="mini-cart-img go-top">
                  <Link to="/product-details">
                    <img
                      src={publicUrl + "assets/img/product/4.png"}
                      alt="Imagen"
                    />
                  </Link>
                  <span className="mini-cart-item-delete">
                    <i className="icon-cancel" />
                  </span>
                </div>
                <div className="mini-cart-info go-top">
                  <h6>
                    <Link to="/product-details">Shock Mount Insulator</Link>
                  </h6>
                  <span className="mini-cart-quantity">1 x $68.00</span>
                </div>
              </div>
            </div>
            <div className="mini-cart-footer">
              <div className="mini-cart-sub-total">
                <h5>
                  Subtotal: <span>$310.00</span>
                </h5>
              </div>
              <div className="btn-wrapper go-top">
                <Link to="/cart" className="theme-btn-1 btn btn-effect-1">
                  View Cart
                </Link>
                <Link to="/cart" className="theme-btn-2 btn btn-effect-2">
                  Checkout
                </Link>
              </div>
              <p>Free Shipping on All Orders Over $100!</p>
            </div>
          </div>
        </div>
        {/* Utilize Cart Menu End */}
      </div>
    );
  }
}

export default Navbar;
