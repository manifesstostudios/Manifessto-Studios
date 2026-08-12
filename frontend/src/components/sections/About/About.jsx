import MainContainer from "../../layout/MainContainer";
import Navbar from "../../common/Navbar";
import Footer from "../../layout/Footer";

import AboutIntro from "./AboutIntro";
import OurTeam from "./OurTeam";

import "./About.css";

const About = () => {
  return (
    <MainContainer>

      <div className="about-page">


        <AboutIntro />

        <OurTeam />


      </div>

    </MainContainer>
  );
};

export default About;