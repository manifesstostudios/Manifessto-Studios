import "./Service.css";

import MainContainer from "../../layout/MainContainer";
import Navbar from "../../common/Navbar";
import Footer from "../../layout/Footer";
import WhatWeDo from "./WhatWeDo";

const Service = () => {
  return (
    <MainContainer>


      <section className="service-hero">

        <div className="service-hero-content">

          <p className="service-hero-eyebrow">
            OUR SERVICES
          </p>

          <h1>
            WE CREATE.
            <br />
            <span>WE BUILD.</span>
            <br />
            WE DELIVER.
          </h1>

          <div className="service-hero-line"></div>

          <p className="service-hero-description">
            From cinematic production and photography
            to design, digital experiences and creative
            campaigns — we bring everything together
            under one roof.
          </p>

        </div>

      </section>

      <WhatWeDo />


    </MainContainer>
  );
};

export default Service;