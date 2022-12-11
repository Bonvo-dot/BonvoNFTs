import React from "react";
import Navbar from "./global-components/navbar";
import PageHeader from "./global-components/page-header";
import ProductSlider from "./shop-components/product-slider-v1";
import ProductDetails from "./shop-components/shop-details";
import Footer from "./global-components/footer";

const Product_Details = () => {
  return (
    <div>
      <Navbar />
      <PageHeader
        headertitle="Descripción de la propiedad"
        customclass="mb-0"
      />
      <ProductSlider />
      <ProductDetails />
      <Footer />
    </div>
  );
};

export default Product_Details;
