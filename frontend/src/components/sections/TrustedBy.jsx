import { useEffect, useState } from "react";

import api from "../../services/api";

import "./TrustedBy.css";

const TrustedBy = () => {

  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchTrustedBrands = async () => {

      try {

        const response = await api.get("/trusted-by");

        setLogos(response.data);

      } catch (error) {

        console.error(
          "Failed to load trusted brands:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchTrustedBrands();

  }, []);

  if (loading) {
    return null;
  }

  return (
    <section className="trusted-section">

      <div className="trusted-container">

        <div className="trusted-label">
          TRUSTED BY
        </div>

        <div className="trusted-carousel">

          <div className="trusted-track">

            {/* First Set */}

            {logos.map((logo) => (

              <div
                key={`first-${logo.id}`}
                className="trusted-logo"
              >
                {logo.name}
              </div>

            ))}

            {/* Duplicate Set */}

            {logos.map((logo) => (

              <div
                key={`second-${logo.id}`}
                className="trusted-logo"
                aria-hidden="true"
              >
                {logo.name}
              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
};

export default TrustedBy;