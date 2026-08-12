

import "./PortfolioIntro.css";

const PortfolioIntro = () => {
  return (
    <section className="portfolio-intro">

      <div className="portfolio-intro-content">

        <p className="portfolio-intro-eyebrow">
          OUR PORTFOLIO
        </p>

        <h1>
          WORK THAT
          <br />
          <span>SPEAKS.</span>
        </h1>

        <div className="portfolio-intro-line"></div>

        <p className="portfolio-intro-description">
          A collection of visual stories, campaigns and
          creative experiences crafted for brands,
          businesses and people.
        </p>

      </div>


      <div className="portfolio-intro-meta">

        <span>
          SELECTED WORK
        </span>

        <span>
          2024 — 2026
        </span>

      </div>

    </section>
  );
};

export default PortfolioIntro;