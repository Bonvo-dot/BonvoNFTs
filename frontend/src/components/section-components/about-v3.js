import React, { Component } from "react";

class AboutV3 extends Component {
  render() {
    let publicUrl = process.env.PUBLIC_URL + "/";
    return (
      <div className="ltn__about-us-area pt-115 pb-100 ">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center">
              <div className="about-us-img-wrap about-img-left">
                <img
                  src={publicUrl + "assets/img/bonvo-01.png"}
                  alt="About Us"
                />
              </div>
            </div>
            <div className="col-lg-6 align-self-center">
              <div className="about-us-info-wrap">
                <div className="section-title-area ltn__section-title-2--- mb-30">
                  <h6 className="section-subtitle section-subtitle-2--- ltn__secondary-color">
                    Nosotros
                  </h6>
                  <h1 className="section-title">¿Que es bonvo oracle?</h1>
                  <p>
                    Bonvo es un oráculo que tiene por objeto brindar información
                    fidedigna de alquiler de propiedades en tiempo real.
                    Mediante la recolección de APIs de la industria inmobiliaria
                    o real estate, se muestran datos recogidos y catalogados de
                    acuerdo a diversos parámetros sobre casas y apartamentos en
                    alquiler.
                    <br />
                    <br /> Bonvo es un smart contract deployado sobre la red de
                    Moonbean, recoge datos off-chain para plasmar en la
                    blockchain, recolectando y actualizando información al
                    instante y te permite tambien cargar nuevas propiedades,
                    brindando la posibilidad de acceder a información
                    actualizada en todo momento. Al intereactuar con la
                    plataforma puedes recibir recompensas en forma de BNV
                    tokens. el token nativo de la plataforma. <br />
                    <br /> Para este hackaton las recompensas se reciben de dos
                    maneras: La primera de ellas es al dejar una reseña en
                    nuestro sitio web, validando la misma al enlazar tu Wallet y
                    verificando tu localización mediante tu ubicación GPS,
                    recibes BNV tokens como recompensa. Y la segunda manera de
                    recibir tokens BNV es cuando cargas los datos de una
                    propiedad, para ser rentada en la plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <img
              src={publicUrl + "assets/img/gallery/roadmap.png"}
              alt="Roadmap"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AboutV3;
