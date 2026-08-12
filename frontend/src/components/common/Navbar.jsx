import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Navbar.css";


const Navbar = ({ onBookSlot }) => {

  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();


  const closeMenu = () => {
    setMenuOpen(false);
  };


  const handleBookSlot = () => {
    closeMenu();

    if (onBookSlot) {
      onBookSlot();
    }
  };


  return (
    <>

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">


        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >

          <img
            src="/src/assets/images/logo-white.png"
            alt="Manifessto Studios"
          />

        </Link>


        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <div className="navbar-links">

          <Link
            to="/"
            className={
              location.pathname === "/"
                ? "active"
                : ""
            }
          >
            Home
          </Link>


          <Link
            to="/about"
            className={
              location.pathname === "/about"
                ? "active"
                : ""
            }
          >
            About
          </Link>


          <Link
            to="/services"
            className={
              location.pathname === "/services"
                ? "active"
                : ""
            }
          >
            Services
          </Link>


          <Link
            to="/portfolio"
            className={
              location.pathname === "/portfolio"
                ? "active"
                : ""
            }
          >
            Portfolio
          </Link>


          <Link
            to="/contact"
            className={
              location.pathname === "/contact"
                ? "active"
                : ""
            }
          >
            Contact
          </Link>

        </div>


        {/* =========================
            DESKTOP BOOKING
        ========================= */}

        <button
          type="button"
          className="navbar-booking"
          onClick={handleBookSlot}
        >

          <span>
            Book Your Slot
          </span>

          <span className="booking-arrow">
            →
          </span>

        </button>


        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </nav>


      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      <div
        className={`menu-overlay ${
          menuOpen ? "show" : ""
        }`}
        onClick={closeMenu}
      />


      {/* =========================
          MOBILE MENU
      ========================= */}

      <aside
        className={`mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >


        {/* =========================
            MOBILE HEADER
        ========================= */}

        <div className="mobile-menu-header">


          <Link
            to="/"
            onClick={closeMenu}
          >

            <img
              src="/src/assets/images/logo-white.png"
              alt="Manifessto Studios"
            />

          </Link>


          <button
            type="button"
            className="close-button"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ×
          </button>

        </div>


        {/* =========================
            MOBILE LINKS
        ========================= */}

        <div className="mobile-menu-links">


          <Link
            to="/"
            onClick={closeMenu}
            className={
              location.pathname === "/"
                ? "active"
                : ""
            }
          >
            Home
          </Link>


          <Link
            to="/about"
            onClick={closeMenu}
            className={
              location.pathname === "/about"
                ? "active"
                : ""
            }
          >
            About
          </Link>


          <Link
            to="/services"
            onClick={closeMenu}
            className={
              location.pathname === "/services"
                ? "active"
                : ""
            }
          >
            Services
          </Link>


          <Link
            to="/portfolio"
            onClick={closeMenu}
            className={
              location.pathname === "/portfolio"
                ? "active"
                : ""
            }
          >
            Portfolio
          </Link>


          <Link
            to="/contact"
            onClick={closeMenu}
            className={
              location.pathname === "/contact"
                ? "active"
                : ""
            }
          >
            Contact
          </Link>

        </div>


        {/* =========================
            MOBILE BOOKING
        ========================= */}

        <button
          type="button"
          className="mobile-booking"
          onClick={handleBookSlot}
        >

          <span>
            Book Your Slot
          </span>

          <span>
            →
          </span>

        </button>

      </aside>

    </>
  );
};


export default Navbar;