import { Link } from "react-router-dom";

import "./Footer.css";

const Footer = ({ onStartProject }) => {
  return (
    <footer className="footer">

      {/* =========================
          MAIN FOOTER
      ========================= */}

      <div className="footer-container">

        {/* =========================
            BRAND
        ========================= */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            <img
              src="https://res.cloudinary.com/cihmo4w9/image/upload/v1786565020/logo-white.png"
              alt="Manifessto Studios"
            />
          </Link>

          <p className="footer-description">
            We create cinematic stories that help
            brands stand out, connect and grow.
          </p>

          {/* START A PROJECT */}

          <button
            type="button"
            className="footer-cta"
            onClick={onStartProject}
          >
            <span>
              Start a Project
            </span>

            <span className="footer-cta-arrow">
              →
            </span>
          </button>

        </div>


        {/* =========================
            QUICK LINKS
        ========================= */}

        <div className="footer-column">

          <h3>
            Explore
          </h3>

          <div className="footer-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/portfolio">
              Portfolio
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/services">
              Services
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>

        </div>


        {/* =========================
            SERVICES
        ========================= */}

        <div className="footer-column">

          <h3>
            Services
          </h3>

          <div className="footer-links">

            <Link to="/services">
              Photography
            </Link>

            <Link to="/services">
              Videography
            </Link>

            <Link to="/services">
              Web Development
            </Link>

            <Link to="/services">
              Design
            </Link>

            <Link to="/services">
              Production Marketing
            </Link>

          </div>

        </div>


        {/* =========================
            CONTACT
        ========================= */}

        <div className="footer-column footer-contact">

          <h3>
            Get in Touch
          </h3>

          <div className="footer-contact-info">

            {/* =========================
                GMAIL
            ========================= */}

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=manifesstostudios@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email Manifessto Studios"
            >
              manifesstostudios@gmail.com
            </a>


            {/* =========================
                PHONE
            ========================= */}

            <a
              href="tel:+917888156307"
              aria-label="Call Manifessto Studios"
            >
              +91 7888156307
            </a>


            {/* =========================
                LOCATION
            ========================= */}

            <p>
              Nagpur, Maharashtra
              <br />
              India
            </p>

          </div>


          {/* =========================
              SOCIALS
          ========================= */}

          <div className="footer-socials">

            <a
              href="#"
              aria-label="Instagram"
            >
              IG
            </a>

            <a
              href="#"
              aria-label="YouTube"
            >
              YT
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
            >
              IN
            </a>

            <a
              href="#"
              aria-label="Facebook"
            >
              FB
            </a>

          </div>

        </div>

      </div>


      {/* =========================
          FOOTER LINE
      ========================= */}

      <div className="footer-divider"></div>


      {/* =========================
          BOTTOM
      ========================= */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Manifessto Studios.
          All rights reserved.
        </p>


        <div className="footer-legal">

          <Link to="/privacy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>

        </div>


        {/* BACK TO TOP */}

        <button
          type="button"
          className="back-to-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          aria-label="Back to top"
        >
          ↑
        </button>

      </div>

    </footer>
  );
};

export default Footer;