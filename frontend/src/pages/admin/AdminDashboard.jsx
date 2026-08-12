import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

import ServicesManagement from "./ServicesManagement";
import ServiceItemsManagement from "./ServiceItemsManagement";
import TrustedBrandsManagement from "./TrustedBrandsManagement";
import TeamManagement from "./TeamManagement";
import AboutStatsManagement from "./AboutStatsManagement";
import ProjectManagement from "./ProjectManagement";
import ReviewsManagement from "./ReviewsManagement";


const AdminDashboard = () => {

  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState("Dashboard");

  const [selectedService, setSelectedService] =
    useState(null);


  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [
    {
      label: "Dashboard",
      icon: "⌂",
    },
    {
      label: "Services",
      icon: "◈",
    },
    {
      label: "Trusted By",
      icon: "◇",
    },
    {
      label: "Team",
      icon: "◎",
    },
    {
      label: "About Stats",
      icon: "▥",
    },
    {
      label: "Projects",
      icon: "▣",
    },
    {
      label: "Reviews",
      icon: "★",
    },
  ];


  // =====================================================
  // SECTION CHANGE
  // =====================================================

  const handleSectionChange = (section) => {

    setActiveSection(section);

    setSelectedService(null);

  };


  // =====================================================
  // MANAGE SERVICE ITEMS
  // =====================================================

  const handleManageItems = (service) => {

    setSelectedService(service);

  };


  // =====================================================
  // BACK TO SERVICES
  // =====================================================

  const handleBackToServices = () => {

    setSelectedService(null);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("adminToken");

    localStorage.removeItem("adminEmail");

    navigate("/admin/login");

  };


  return (

    <div className="admin-dashboard">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">


        {/* BRAND */}

        <div className="admin-sidebar-brand">

          <p className="admin-brand-eyebrow">
            MANIFESSTO
          </p>

          <h2>
            STUDIOS
          </h2>

          <span className="admin-brand-label">
            ADMIN PANEL
          </span>

        </div>


        {/* MENU */}

        <nav className="admin-sidebar-menu">

          <p className="admin-menu-label">
            MANAGEMENT
          </p>


          {menuItems.map((item) => (

            <button
              type="button"
              key={item.label}
              className={`admin-menu-item ${
                activeSection === item.label
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleSectionChange(
                  item.label
                )
              }
            >

              <span className="admin-menu-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </button>

          ))}

        </nav>


        {/* LOGOUT */}

        <div className="admin-sidebar-bottom">

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >

            <span>
              ↪
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-main">


        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="admin-topbar">

          <div>

            <p className="admin-topbar-eyebrow">
              ADMIN PANEL
            </p>

            <h1>

              {selectedService
                ? selectedService.title
                : activeSection}

            </h1>

          </div>


          {/* ADMIN USER */}

          <div className="admin-user">

            <div className="admin-user-avatar">
              A
            </div>

            <div className="admin-user-info">

              <strong>
                Administrator
              </strong>

              <span>
                {localStorage.getItem(
                  "adminEmail"
                )}
              </span>

            </div>

          </div>

        </header>


        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activeSection === "Dashboard" && (

          <section className="admin-dashboard-content">


            {/* WELCOME */}

            <div className="admin-welcome">

              <div>

                <p className="admin-section-eyebrow">
                  OVERVIEW
                </p>

                <h2>
                  Welcome back, Admin.
                </h2>

                <p>
                  Manage your studio content,
                  projects and client interactions
                  from one place.
                </p>

              </div>

            </div>


            {/* STAT CARDS */}

            <div className="admin-stat-grid">


              <div className="admin-stat-card">

                <span>
                  SERVICES
                </span>

                <strong>
                  —
                </strong>

                <p>
                  Active services
                </p>

              </div>


              <div className="admin-stat-card">

                <span>
                  TEAM
                </span>

                <strong>
                  —
                </strong>

                <p>
                  Team members
                </p>

              </div>


              <div className="admin-stat-card">

                <span>
                  PROJECTS
                </span>

                <strong>
                  —
                </strong>

                <p>
                  Featured projects
                </p>

              </div>


              <div className="admin-stat-card">

                <span>
                  REVIEWS
                </span>

                <strong>
                  —
                </strong>

                <p>
                  Client reviews
                </p>

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div className="admin-quick-section">

              <div className="admin-section-heading">

                <div>

                  <p className="admin-section-eyebrow">
                    QUICK ACTIONS
                  </p>

                  <h2>
                    Manage Content
                  </h2>

                </div>

              </div>


              <div className="admin-quick-grid">


                {/* SERVICES */}

                <button
                  type="button"
                  onClick={() =>
                    handleSectionChange(
                      "Services"
                    )
                  }
                >

                  <span>
                    +
                  </span>

                  <strong>
                    Manage Services
                  </strong>

                  <small>
                    Add, edit or remove services
                  </small>

                </button>


                {/* TEAM */}

                <button
                  type="button"
                  onClick={() =>
                    handleSectionChange(
                      "Team"
                    )
                  }
                >

                  <span>
                    +
                  </span>

                  <strong>
                    Manage Team
                  </strong>

                  <small>
                    Manage studio members
                  </small>

                </button>


                {/* ABOUT STATS */}

                <button
                  type="button"
                  onClick={() =>
                    handleSectionChange(
                      "About Stats"
                    )
                  }
                >

                  <span>
                    +
                  </span>

                  <strong>
                    Manage About Stats
                  </strong>

                  <small>
                    Update About page statistics
                  </small>

                </button>


                {/* PROJECTS */}

                <button
                  type="button"
                  onClick={() =>
                    handleSectionChange(
                      "Projects"
                    )
                  }
                >

                  <span>
                    +
                  </span>

                  <strong>
                    Manage Projects
                  </strong>

                  <small>
                    Update featured work
                  </small>

                </button>


                {/* REVIEWS */}

                <button
                  type="button"
                  onClick={() =>
                    handleSectionChange(
                      "Reviews"
                    )
                  }
                >

                  <span>
                    +
                  </span>

                  <strong>
                    Manage Reviews
                  </strong>

                  <small>
                    Review client feedback
                  </small>

                </button>


              </div>

            </div>

          </section>

        )}


        {/* =================================================
            SERVICES
        ================================================= */}

        {activeSection === "Services" &&
          !selectedService && (

            <ServicesManagement
              onManageItems={
                handleManageItems
              }
            />

          )}


        {/* =================================================
            SERVICE ITEMS
        ================================================= */}

        {activeSection === "Services" &&
          selectedService && (

            <ServiceItemsManagement
              service={selectedService}
              onBack={
                handleBackToServices
              }
            />

          )}


        {/* =================================================
            TRUSTED BY
        ================================================= */}

        {activeSection === "Trusted By" && (

          <TrustedBrandsManagement />

        )}


        {/* =================================================
            TEAM
        ================================================= */}

        {activeSection === "Team" && (

          <TeamManagement />

        )}


        {/* =================================================
            ABOUT STATS
        ================================================= */}

        {activeSection === "About Stats" && (

          <AboutStatsManagement />

        )}


        {/* =================================================
            PROJECTS — NEW
        ================================================= */}

        {activeSection === "Projects" && (

          <ProjectManagement />

        )}


        {/* =================================================
            REVIEWS
        ================================================= */}
          {activeSection === "Reviews" && (
            <ReviewsManagement />
          )}

      </main>

    </div>

  );

};


export default AdminDashboard;