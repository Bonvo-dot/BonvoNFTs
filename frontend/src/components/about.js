import React from "react";
import Navbar from "./global-components/navbar";
import PageHeader from "./global-components/page-header";
import AboutV3 from "./section-components/about-v3";
import CallToActionV1 from "./section-components/call-to-action-v1";
import Footer from "./global-components/footer";

const About_v1 = () => {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Nosotros" />
      <AboutV3 />
      <CallToActionV1 />
      <Footer />
    </div>
  );
};

export default About_v1;
