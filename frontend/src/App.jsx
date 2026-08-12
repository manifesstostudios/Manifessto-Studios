import MainContainer from "./components/layout/MainContainer";

import Hero from "./components/sections/Hero";
import TrustedBy from "./components/sections/TrustedBy";
import Founders from "./components/sections/Founders";
import FeaturedWork from "./components/sections/FeaturedWork";
import OurProcess from "./components/sections/OurProcess";
import Reviews from "./components/sections/Reviews";
import CTASection from "./components/sections/CTASection";


function App({ onStartProject }) {

  return (
    <MainContainer>

      {/* =========================
          HERO
      ========================= */}

      <div className="hero-wrapper">

        <Hero
          onStartProject={onStartProject}
        />

      </div>


      {/* =========================
          HOME SECTIONS
      ========================= */}

      <TrustedBy />

      <Founders />

      <FeaturedWork />

      <OurProcess />

      <Reviews />


      {/* =========================
          CTA
      ========================= */}

      <CTASection
        onStartProject={onStartProject}
      />

    </MainContainer>
  );
}


export default App;