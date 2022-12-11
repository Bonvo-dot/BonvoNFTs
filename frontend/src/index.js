import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import HomeV3 from "./components/home-v3";
import ContextProviderWeb3 from "./moonbeam/ContextProviderWeb3";
import About from "./components/about";
import Shop from "./components/shop";
import ProdductDetails from "./components/product-details";
import Contact from "./components/contact";
import MyAccount from "./components/my-account";
import AddListing from "./components/add-listing";

// import Service from "./components/service";
// import ServiceDetails from "./components/service-details";
// import Portfolio from "./components/portfolio";
// import PortfolioV2 from "./components/portfolio-v2";
// import PortfolioDetails from "./components/portfolio-details";
// import Team from "./components/team";
// import TeamDetails from "./components/team-details";
// import Faq from "./components/faq";
// import ComingSoon from "./components/coming-soon";
// import Error from "./components/404";
// import Location from "./components/location";

// import ShopGrid from "./components/shop-grid";
// import ShopLeftSidebar from "./components/shop-left-sidebar";
// import ShopRightSidebar from "./components/shop-right-sidebar";

// import BlogGrid from "./components/blog-grid";
// import BlogLeftSidebar from "./components/blog-left-sidebar";
// import BlogRightSidebar from "./components/blog-right-sidebar";
// import Blog from "./components/blog";

// import BlogDetails from "./components/blog-details";
// import Cart from "./components/cart";
// import Checkout from "./components/checkout";
// import Login from "./components/login";
// import Register from "./components/register";
// import Wishlist from "./components/wishlist";
// import OrderTracking from "./components/order-tracking";
// import History from "./components/history";

function Root() {
  return (
    <ContextProviderWeb3>
      <HashRouter basename="/">
        <div>
          <Switch>
            <Route exact path="/" component={HomeV3} />

            <Route path="/about" component={About} />
            <Route path="/shop" component={Shop} />
            <Route path="/contact" component={Contact} />
            <Route path="/my-account" component={MyAccount} />
            <Route path="/add-listing" component={AddListing} />
            <Route path="/product-details" component={ProdductDetails} />

            {/* <Route path="/service" component={Service} />
            <Route path="/service-details" component={ServiceDetails} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/portfolio-v2" component={PortfolioV2} />
            <Route path="/team" component={Team} />
            <Route path="/portfolio-details" component={PortfolioDetails} />
            <Route path="/team-details" component={TeamDetails} />
            <Route path="/faq" component={Faq} />
            <Route path="/coming-soon" component={ComingSoon} />
            <Route path="/404" component={Error} />
            <Route path="/location" component={Location} />
            <Route path="/shop-grid" component={ShopGrid} />
            <Route path="/shop-left-sidebar" component={ShopLeftSidebar} />
            <Route path="/shop-right-sidebar" component={ShopRightSidebar} /> */}

            {/* blog */}
            {/* <Route path="/blog-grid" component={BlogGrid} />
            <Route path="/blog-left-sidebar" component={BlogLeftSidebar} />
            <Route path="/blog-right-sidebar" component={BlogRightSidebar} />
            <Route path="/blog" component={Blog} />

            <Route path="/blog-details" component={BlogDetails} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/wishlist" component={Wishlist} />
            <Route path="/order-tracking" component={OrderTracking} />
            <Route path="/history" component={History} /> */}
          </Switch>
        </div>
      </HashRouter>
    </ContextProviderWeb3>
  );
}

export default Root;

ReactDOM.render(<Root />, document.getElementById("bonvo"));
