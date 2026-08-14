import { Routes, Route } from "react-router-dom";

import App from "./App";

import About from "./components/sections/About/About";
import Service from "./components/sections/Services/Service";
import Portfolio from "./components/sections/Portfolio/Portfolio";
import Contact from "./components/sections/Contact/Contact";
import SiteLayout from "./components/layout/SiteLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Terms from "./pages/Terms/Terms";


function AppRoutes() {

  return (
    <Routes>
            <Route
        path="/admin/login"
        element={<AdminLogin />}
      />
          <Route
      path="/admin/dashboard"
      element={<AdminDashboard />}
    />

      {/* =========================
          HOME
      ========================= */}
      <Route
        path="/"
        element={
          <SiteLayout>
            <App />
          </SiteLayout>
        }
      />
      <Route
        path="/privacy"
        element={
          <SiteLayout>
            <PrivacyPolicy />
          </SiteLayout>
        }
      />
      <Route
        path="/terms"
        element={
          <SiteLayout>
            <Terms />
          </SiteLayout>
        }
      />

      {/* =========================
          ABOUT
      ========================= */}

      <Route
        path="/about"
        element={
          <SiteLayout>
            <About />
          </SiteLayout>
        }
      />



      {/* =========================
          SERVICES
      ========================= */}

      <Route
        path="/services"
        element={
          <SiteLayout>
            <Service />
          </SiteLayout>
        }
      />
            <Route
        path="/contact"
        element={
          <SiteLayout>
            <Contact/>
          </SiteLayout>
        }
      />


      {/* =========================
          PORTFOLIO
      ========================= */}

      <Route
        path="/portfolio"
        element={
          <SiteLayout>
            <Portfolio />
          </SiteLayout>
        }
      />

    </Routes>
  );
}


export default AppRoutes;