import { useState } from "react";
import "./ProjectInquiry.css";

const WHATSAPP_NUMBER = "917888156307";

const services = [
  "Photography",
  "Videography",
  "Wedding",
  "Reels / Content",
  "Branding & Design",
  "Social Media",
  "Website / Digital",
  "Creative Campaign",
  "Other",
];

const ProjectInquiry = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    service: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const mobile = formData.mobile.trim();
    const service = formData.service;

    if (!name || !mobile || !service) {
      setError("Please fill in all the details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const message = `Hello Manifessto Studios,

I would like to start a project.

Name: ${name}
Mobile: ${mobile}
Service: ${service}

Please contact me regarding the project.

Thank you.`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    setFormData({
      name: "",
      mobile: "",
      service: "",
    });

    setError("");
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="project-inquiry-overlay"
      onMouseDown={onClose}
    >

      <div
        className="project-inquiry-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >

        {/* =========================
            CLOSE BUTTON
        ========================= */}

        <button
          type="button"
          className="project-inquiry-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>


        {/* =========================
            HEADER
        ========================= */}

        <div className="project-inquiry-header">

          <p className="project-inquiry-eyebrow">
            MANIFESSTO STUDIOS
          </p>

          <h2>
            LET'S START
            <br />
            <span>A PROJECT.</span>
          </h2>

          <p className="project-inquiry-description">
            Tell us a little about what you need and
            we’ll get back to you shortly.
          </p>

        </div>


        {/* =========================
            FORM
        ========================= */}

        <form
          className="project-inquiry-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="project-inquiry-field">

            <label htmlFor="project-name">
              YOUR NAME
            </label>

            <input
              id="project-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
            />

          </div>


          {/* MOBILE */}

          <div className="project-inquiry-field">

            <label htmlFor="project-mobile">
              MOBILE NUMBER
            </label>

            <input
              id="project-mobile"
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              maxLength="10"
              autoComplete="tel"
            />

          </div>


          {/* SERVICE */}

          <div className="project-inquiry-field">

            <label htmlFor="project-service">
              WHAT DO YOU NEED?
            </label>

            <select
              id="project-service"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >

              <option value="">
                Select a service
              </option>

              {services.map((service) => (
                <option
                  value={service}
                  key={service}
                >
                  {service}
                </option>
              ))}

            </select>

          </div>


          {/* ERROR */}

          {error && (
            <p className="project-inquiry-error">
              {error}
            </p>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className="project-inquiry-submit"
          >

            <span>
              SEND REQUEST
            </span>

            <span className="project-inquiry-submit-arrow">
              →
            </span>

          </button>

        </form>


        {/* =========================
            FOOTER NOTE
        ========================= */}

        <p className="project-inquiry-note">
          Your request will open directly in WhatsApp.
        </p>

      </div>

    </div>
  );
};

export default ProjectInquiry;