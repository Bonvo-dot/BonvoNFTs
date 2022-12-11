import React from "react";
import Navbar from "./global-components/navbar";
import PageHeader from "./global-components/page-header";
import AddPropertyForm from "./../moonbeam/AddPropertyForm";
import CallToActionV1 from "./section-components/call-to-action-v1";
import Footer from "./global-components/footer";

const AddListing_V1 = () => {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Agregar Propiedad" />
      <div className="container">
        <AddPropertyForm />
      </div>

      <br />
      <br />
      <br />

      <CallToActionV1 />
      <Footer />
    </div>
  );
};

export default AddListing_V1;
