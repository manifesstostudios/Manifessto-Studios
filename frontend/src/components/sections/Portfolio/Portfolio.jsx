import "./Portfolio.css";

import Navbar from "../../common/Navbar";
import Footer from "../../layout/Footer";

import PortfolioIntro from "./PortfolioIntro";
import PortfolioWork from "./PortfolioWork";
import PortfolioCard from "./PortfolioCard";

const Portfolio = () => {
  return (
    <main className="portfolio-page">


      <PortfolioIntro />

      <PortfolioWork />

      <PortfolioCard />


    </main>
  );
};

export default Portfolio;