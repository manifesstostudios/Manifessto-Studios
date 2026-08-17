import "./Hero.css";

const Hero = ({ onStartProject }) => {
  return (
    <section className="hero">

      {/* =========================
          DESKTOP / LANDSCAPE VIDEO
      ========================= */}

      <video
        className="hero-video hero-video-desktop"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://res.cloudinary.com/cihmo4w9/video/upload/v1786564871/hero1.mp4"
          type="video/mp4"
        />
      </video>


      {/* =========================
          MOBILE / PORTRAIT VIDEO
      ========================= */}

      <video
        className="hero-video hero-video-mobile"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://res.cloudinary.com/cihmo4w9/video/upload/v1786632513/mobile.home.mp4"
          type="video/mp4"
        />
      </video>


      {/* =========================
          DARK OVERLAY
      ========================= */}

      <div className="hero-overlay"></div>


      {/* =========================
          HERO CONTENT
      ========================= */}

      <div className="hero-content">

        <p className="hero-eyebrow">
          WE CREATE
        </p>


        <h1>
          Cinematic Stories
          <br />
          That Build Brands.
        </h1>


        <p className="hero-description">
          Photography, videography and content creation
          <br />
          that helps your brand stand out and connect
          <br />
          deeply with your audience.
        </p>


        {/* =========================
            HERO BUTTONS
        ========================= */}

        <div className="hero-buttons">

          {/* VIEW OUR WORK */}

          <a
            href="/portfolio"
            className="hero-primary-btn"
          >
            <span>
              View Our Work
            </span>

            <span>
              →
            </span>
          </a>


          {/* BOOK YOUR SLOT */}

          <button
            type="button"
            className="hero-secondary-btn"
            onClick={onStartProject}
          >
            <span>
              Book Your Slot
            </span>

            <span>
              →
            </span>
          </button>

        </div>

      </div>


      {/* =========================
          SCROLL INDICATOR
      ========================= */}

      <div className="hero-scroll">

        <span>
          ↓
        </span>

      </div>

    </section>
  );
};

export default Hero;