import "./PortfolioCard.css";


const PortfolioCard = () => {
  return (
    <section className="portfolio-card-section">

      <div className="portfolio-card">

        {/* =========================
            BACKGROUND IMAGE
        ========================= */}

        <div className="portfolio-card-image-wrapper">

          <img
            src="https://res.cloudinary.com/cihmo4w9/image/upload/v1786622512/production.png"
            alt="Manifessto Studios Portfolio"
            className="portfolio-card-image"
          />

          <div className="portfolio-card-overlay"></div>

        </div>


        {/* =========================
            CONTENT
        ========================= */}

        <div className="portfolio-card-content">

          <p>
            MANIFESSTO STUDIOS
          </p>

          <h2>
            EXPLORE OUR
            <br />
            FULL PORTFOLIO.
          </h2>

          <span>
            Photography · Films · Design · Digital
          </span>

          <a
            href="https://drive.google.com/drive/folders/1_TbhN48fqU5-S6lm7OLX7Sg-OFfDlBi5?usp=drive_link"
            className="portfolio-card-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              View Portfolio
            </span>

            <span className="portfolio-card-arrow">
              →
            </span>
          </a>

        </div>


        {/* =========================
            CARD CORNER
        ========================= */}

        <div className="portfolio-card-corner">
          01 / 01
        </div>

      </div>

    </section>
  );
};

export default PortfolioCard;