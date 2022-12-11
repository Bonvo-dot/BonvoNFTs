import { BigNumber } from "ethers";
import React from "react";

const Sidebar = (props) => {
  const { setAssets, filterByCategory, setFilterByCategory } = props;
  const handleFilterByCategory = (e) => {
    setFilterByCategory(BigNumber.from(parseInt(e.target.name)));
    setAssets([]);
  };

  let anchor = "#";

  let publicUrl = process.env.PUBLIC_URL + "/";
  return (
    <div className="col-lg-4  mb-100">
      <aside className="sidebar ltn__shop-sidebar">
        <h3 className="mb-10">Información</h3>
        {/* Advance Information widget */}
        <div className="widget ltn__menu-widget">
          <h4 className="ltn__widget-title">Tipo de propiedad</h4>
          <ul>
            <li>
              <label className="checkbox-item">
                Casa
                <input
                  type="checkbox"
                  name="2"
                  checked={filterByCategory === "2"}
                  onChange={handleFilterByCategory}
                />
                <span className="checkmark" />
              </label>
              <span className="categorey-no">3,924</span>
            </li>
            <li>
              <label className="checkbox-item">
                Apartamento
                <input
                  type="checkbox"
                  name="0"
                  checked={filterByCategory === "0"}
                  onChange={handleFilterByCategory}
                />
                <span className="checkmark" />
              </label>
              <span className="categorey-no">3,610</span>
            </li>
            <li>
              <label className="checkbox-item">
                Oficina
                <input
                  type="checkbox"
                  name="5"
                  checked={filterByCategory === "5"}
                  onChange={handleFilterByCategory}
                />
                <span className="checkmark" />
              </label>
              <span className="categorey-no">2,912</span>
            </li>
            <li>
              <label className="checkbox-item">
                Duplex
                <input
                  type="checkbox"
                  name="1"
                  checked={filterByCategory === "1"}
                  onChange={handleFilterByCategory}
                />
                <span className="checkmark" />
              </label>
              <span className="categorey-no">2,687</span>
            </li>
            <li>
              <label className="checkbox-item">
                Industrial
                <input
                  type="checkbox"
                  name="3"
                  checked={filterByCategory === "3"}
                  onChange={handleFilterByCategory}
                />
                <span className="checkmark" />
              </label>
              <span className="categorey-no">2,687</span>
            </li>
          </ul>
          <hr />

          <div className="widget--- ltn__price-filter-widget">
            <h4 className="ltn__widget-title ltn__widget-title-border---">
              Filtrar por precio
            </h4>
            <div className="price_filter">
              <div className="price_slider_amount">
                <input type="submit" defaultValue="Your range:" />
                <input
                  type="text"
                  className="amount"
                  name="price"
                  placeholder="Ingresa el precio"
                />
              </div>
              <div className="slider-range" />
            </div>
          </div>

          <h4 className="ltn__widget-title">Categoria</h4>
          <ul>
            <li>
              <label className="checkbox-item">
                Alquiler
                <input type="checkbox" />
                <span className="checkmark" />
              </label>
              <span className="categorey-no">3,610</span>
            </li>
          </ul>
        </div>

        {/* Price Filter Widget */}
        <div className="widget ltn__price-filter-widget d-none">
          <h4 className="ltn__widget-title ltn__widget-title-border">
            Filtrar por precio
          </h4>
          <div className="price_filter">
            <div className="price_slider_amount">
              <input type="submit" defaultValue="Your range:" />
              <input
                type="text"
                className="amount"
                name="price"
                placeholder="Add Your Price"
              />
            </div>
            <div className="slider-range" />
          </div>
        </div>

        {/* Banner Widget */}
        <div className="widget ltn__banner-widget d-none">
          <a href="shop.html">
            <img src="img/banner/banner-2.jpg" alt="#" />
          </a>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
