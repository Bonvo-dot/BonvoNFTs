import React, { Component } from "react";
import { Link } from "react-router-dom";

class CallToActonV1 extends Component {
  render() {
    return (
      <div className="ltn__call-to-action-area call-to-action-6 before-bg-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="call-to-action-inner call-to-action-inner-6 ltn__secondary-bg position-relative text-center---">
                <div className="coll-to-info text-color-white">
                  <h1>Buscas tu casa ideal?</h1>
                  <p>Te ayudamos a encontrar la casa de tus sueños/</p>
                </div>
                <div className="btn-wrapper go-top">
                  <Link className="btn btn-effect-3 btn-white" to="/shop">
                    Ver listado de properties <i className="icon-next" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CallToActonV1;
