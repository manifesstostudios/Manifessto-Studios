import { useState, cloneElement } from "react";

import Navbar from "../common/Navbar";
import Footer from "./Footer";
import ProjectInquiry from "../common/ProjectInquiry/ProjectInquiry";


const SiteLayout = ({ children }) => {

  const [inquiryOpen, setInquiryOpen] = useState(false);


  const openInquiry = () => {
    setInquiryOpen(true);
  };


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