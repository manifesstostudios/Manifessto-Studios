import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./WhatWeDo.css";

const WhatWeDo = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH SERVICES + SERVICE ITEMS
  // =====================================================

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesResponse = await api.get("/services");

        const serviceData = servicesResponse.data;

        const servicesWithItems = await Promise.all(
          serviceData.map(async (service) => {
            try {
              const itemsResponse = await api.get(
                `/services/${service.id}/items`
              );

              return {
                ...service,
                items: itemsResponse.data,
              };
            } catch (error) {
              console.error(
                `Failed to load items for service ${service.id}:`,
                error
              );

              return {
                ...service,
                items: [],
              };
            }
          })
        );

        setServices(servicesWithItems);
      } catch (error) {
        console.error(
          "Failed to load services:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="what-we-do">
        <div className="what-we-do-header">
          <div className="what-we-do-header-left">
            <p className="what-we-do-eyebrow">
              WHAT WE DO
            </p>

            <h2>
              ONE STUDIO.
              <br />
              <span>FROM IDEA TO EXECUTION.</span>
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="what-we-do">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="what-we-do-header">

        <div className="what-we-do-header-left">

          <p className="what-we-do-eyebrow">
            WHAT WE DO
          </p>

          <h2>
            ONE STUDIO.
            <br />
            <span>FROM IDEA TO EXECUTION.</span>
          </h2>

        </div>

        <div className="what-we-do-header-right">

          <p>
            From the first idea to the final frame,
            we bring strategy, creativity and
            execution together under one roof.
          </p>

          <span className="what-we-do-header-line">
            {String(services.length).padStart(2, "0")} SERVICES
          </span>

        </div>

      </div>

      {/* =================================================
          SERVICES GRID
      ================================================= */}

      <div className="what-we-do-grid">

        {services.map((service, index) => (

          <article
            className="service-card"
            key={service.id}
          >

            {/* BIG BACKGROUND NUMBER */}

            <span className="service-bg-number">
              {String(
                service.displayOrder ?? index + 1
              ).padStart(2, "0")}
            </span>

            {/* TOP */}

            <div className="service-card-top">

              <div className="service-icon">
                <span>
                  {service.icon}
                </span>
              </div>

              <span className="service-number">
                {String(
                  service.displayOrder ?? index + 1
                ).padStart(2, "0")}
              </span>

            </div>

            {/* TITLE */}

            <div className="service-heading">

              <h3>
                {service.title}
              </h3>

              <div className="service-title-line"></div>

            </div>

            {/* DESCRIPTION */}

            <p className="service-description">
              {service.description}
            </p>

            {/* SERVICE LIST */}

            <ul className="service-list">

              {service.items.map((item, itemIndex) => (

                <li
                  key={item.id}
                  style={{
                    "--item-index": itemIndex,
                  }}
                >

                  <span className="service-dot"></span>

                  <span>
                    {item.itemName}
                  </span>

                </li>

              ))}

            </ul>

            {/* IMAGE */}

            <div className="service-image-wrapper">

              <img
                src={service.imageUrl}
                alt={service.title}
                className="service-image"
                draggable="false"
              />

              <div className="service-image-overlay"></div>

              <span className="service-image-label">
                {service.shortTitle}
              </span>

            </div>

          </article>

        ))}

      </div>

      {/* =================================================
          BOTTOM STATEMENT
      ================================================= */}

      <div className="what-we-do-bottom">

        <span className="what-we-do-bottom-line"></span>

        <p>
          ONE TEAM. MULTIPLE DISCIPLINES.
          <strong> ONE VISION.</strong>
        </p>

        <span className="what-we-do-bottom-line"></span>

      </div>

    </section>
  );
};

export default WhatWeDo;