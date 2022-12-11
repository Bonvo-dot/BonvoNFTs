import React from "react";
import Navbar from "./global-components/navbar";
import PageHeader from "./global-components/page-header";
import ContactInfo from "./section-components/contact-info";
import ContactForm from "./section-components/contact-form";
import CallToActionV1 from "./section-components/call-to-action-v1";
import Footer from "./global-components/footer";

const ContactV1 = () => {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Contacto" subheader="Contacto" />
      <ContactInfo />
      <ContactForm />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default ContactV1;
