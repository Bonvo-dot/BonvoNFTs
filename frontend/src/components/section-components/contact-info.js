import React, { Component } from "react";

class ContactInfo extends Component {
  render() {
    let publicUrl = process.env.PUBLIC_URL + "/";

    return (
      <div className="ltn__contact-address-area mb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow">
                <div className="ltn__contact-address-icon">
                  <img src={publicUrl + "assets/img/icons/10.png"} alt="Icon" />
                </div>
                <h3>Correo</h3>
                <p>bonvo.oficial@gmail.com</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow">
                <div className="ltn__contact-address-icon">
                  <img src={publicUrl + "assets/img/icons/11.png"} alt="Icon" />
                </div>
                <h3>Teléfono</h3>
                <p>+686 135 0380</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactInfo;
