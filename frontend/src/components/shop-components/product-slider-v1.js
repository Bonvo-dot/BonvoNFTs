import React, { Component } from "react";

class ProductSliderV1 extends Component {
  render() {
    let publicUrl = process.env.PUBLIC_URL + "/";

    return (
      <div className="ltn__img-slider-area mb-90">
        <div className="container-fluid">
          <div className="row ltn__image-slider-5-active slick-arrow-1 slick-arrow-1-inner ltn__no-gutter-all">
            <div className="col-lg-12">
              <div className="ltn__img-slide-item-4">
                <a
                  href={publicUrl + "assets/img/houses/house1-big.jpg"}
                  data-rel="lightcase:myCollection"
                >
                  <img
                    src={publicUrl + "assets/img/houses/house1-big.jpg"}
                    alt="Imagen"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="ltn__img-slide-item-4">
                <a
                  href={publicUrl + "assets/img/houses/house2-big.jpg"}
                  data-rel="lightcase:myCollection"
                >
                  <img
                    src={publicUrl + "assets/img/houses/house2-big.jpg"}
                    alt="Imagen"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="ltn__img-slide-item-4">
                <a
                  href={publicUrl + "assets/img/houses/house3-big.jpg"}
                  data-rel="lightcase:myCollection"
                >
                  <img
                    src={publicUrl + "assets/img/houses/house3-big.jpg"}
                    alt="Imagen"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="ltn__img-slide-item-4">
                <a
                  href={publicUrl + "assets/img/houses/house4-big.jpg"}
                  data-rel="lightcase:myCollection"
                >
                  <img
                    src={publicUrl + "assets/img/houses/house4-big.jpg"}
                    alt="Imagen"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="ltn__img-slide-item-4">
                <a
                  href={publicUrl + "assets/img/houses/house5-big.jpg"}
                  data-rel="lightcase:myCollection"
                >
                  <img
                    src={publicUrl + "assets/img/houses/house5-big.jpg"}
                    alt="Imagen"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductSliderV1;
