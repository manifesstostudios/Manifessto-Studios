import { useState, cloneElement, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../common/Navbar";
import Footer from "./Footer";
import ProjectInquiry from "../common/ProjectInquiry/ProjectInquiry";


const SiteLayout = ({ children }) => {

  const [inquiryOpen, setInquiryOpen] = useState(false);

  const location = useLocation();


  // =====================================================
  // SCROLL TO TOP WHEN ROUTE CHANGES
  // =====================================================

  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

  }, [location.pathname]);


  // =====================================================
  // OPEN PROJECT INQUIRY
  // =====================================================

  const openInquiry = () => {
    setInquiryOpen(true);
  };


  // =====================================================
  // CLOSE PROJECT INQUIRY
  // =====================================================

  const closeInquiry = () => {
    setInquiryOpen(false);
  };


  return (
    <>

      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar
        onBookSlot={openInquiry}
      />


      {/* =========================
          PAGE CONTENT
      ========================= */}

      {cloneElement(children, {
        onStartProject: openInquiry,
      })}


      {/* =========================
          FOOTER
      ========================= */}

      <Footer
        onStartProject={openInquiry}
      />


      {/* =========================
          PROJECT INQUIRY
      ========================= */}

      <ProjectInquiry
        isOpen={inquiryOpen}
        onClose={closeInquiry}
      />

    </>
  );
};


export default SiteLayout;