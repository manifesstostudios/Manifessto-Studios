import "./CTASection.css";


const CTASection = ({ onStartProject }) => {

  return (
    <section className="cta-section">


      {/* =========================
          BACKGROUND IMAGE
      ========================= */}

      <div className="cta-background"></div>


      {/* =========================
          DARK OVERLAY
      ========================= */}

      <div className="cta-overlay"></div>


      {/* =========================
          CONTENT
      ========================= */}

      <div className="cta-content">


        <p className="cta-eyebrow">
          LET'S CREATE TOGETHER
        </p>


        <h2>
          Let's Create Something
          <br />
          <span>
            Extraordinary.
          </span>
        </h2>


        <p className="cta-description">
          Have a story worth telling?
          <br className="cta-desktop-break" />
          Let's bring your vision to life.
        </p>


        {/* =========================
            PROJECT / BOOKING BUTTON
        ========================= */}

        <button
          type="button"
          className="cta-button"
          onClick={onStartProject}
        >

          <span>
            Book Your Shoot
          </span>

          <span className="cta-arrow">
            →
          </span>

        </button>


      </div>


      {/* =========================
          DECORATIVE CORNERS
      ========================= */}

      <div
        className="cta-corner cta-corner-top"
      ></div>

      <div
        className="cta-corner cta-corner-bottom"
      ></div>


    </section>
  );
};


export default CTASection;