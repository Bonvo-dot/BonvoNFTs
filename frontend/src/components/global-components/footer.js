import React, { Component } from "react";
import { Link } from "react-router-dom";
import Social from "../section-components/social";
import Copyright from "./copyright";

class Footer_v1 extends Component {
  componentDidMount() {
    const $ = window.$;

    let publicUrl = process.env.PUBLIC_URL + "/";
    const minscript = document.createElement("script");
    minscript.async = true;
    minscript.src = publicUrl + "assets/js/main.js";

    document.body.appendChild(minscript);

    $(".go-top")
      .find("a")
      .on("click", function () {
        $(".bonvo-overlay").fadeIn(1);

        $(window).scrollTop(0);

        setTimeout(function () {
          $(".bonvo-overlay").fadeOut(300);
        }, 800);
      });

    $(document).on("click", ".theme-btn-1 ", function () {
      $("div").removeClass("modal-backdrop");
      $("div").removeClass("show");
      $("div").removeClass("fade");
      $("body").attr("style", "");
    });
  }

  render() {
    let publicUrl = process.env.PUBLIC_URL + "/";
    let imgattr = "Footer logo";

    return (
      <footer className="ltn__footer-area  ">
        <div className="footer-top-area  section-bg-2 plr--5">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-2 col-12"></div>
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="footer-widget footer-about-widget">
                  <div className="footer-logo">
                    <div className="site-logo">
                      <img
                        src={publicUrl + "assets/img/logo-2_floating.png"}
                        alt="Logo"
                      />
                    </div>
                  </div>
                  <p>
                    Con bonvo podrás encontrar todo tipo de casas para todo tipo
                    de momentos.
                  </p>
                  <div className="footer-address">
                    <ul>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-placeholder" />
                        </div>
                        <div className="footer-address-info">
                          <p>Argentina, Bolivia, Mexico, Uruguay.</p>
                        </div>
                      </li>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-call" />
                        </div>
                        <div className="footer-address-info">
                          <p>
                            <a href="tel:6861350380">686 135 0380</a>
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-mail" />
                        </div>
                        <div className="footer-address-info">
                          <p>
                            <a href="mailto:bonvo.oficial@gmail.com">
                              bonvo.oficial@gmail.com
                            </a>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="ltn__social-media mt-20">
                    <Social />
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-2 col-sm-6 col-12">
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">Proyecto</h4>
                  <div className="footer-menu go-top">
                    <ul>
                      <li>
                        <Link to="/about">Nosotros</Link>
                      </li>
                      <li>
                        <Link to="/shop">Ver propiedades</Link>
                      </li>
                      <li>
                        <Link to="/contact">Contacto</Link>
                      </li>
                      <li>
                        <Link to="/about">Terminos y condiciones</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-2 col-sm-6 col-12">
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">Servicio al cliente</h4>
                  <div className="footer-menu go-top">
                    <ul>
                      <li>
                        <Link to="/add-listing">Agregar propiedad</Link>
                      </li>
                      <li>
                        <Link to="/contact">Contacto</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer_v1;
