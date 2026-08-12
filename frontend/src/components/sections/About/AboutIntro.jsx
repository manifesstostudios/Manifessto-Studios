import { useEffect, useState } from "react";

import api from "../../../services/api";

import "./AboutIntro.css";

const AboutIntro = () => {

  const [stats, setStats] = useState([]);
  const [counts, setCounts] = useState([]);

  // =====================================================
  // FETCH ABOUT STATS
  // =====================================================

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const response = await api.get(
          "/about-stats"
        );

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        const sortedStats = [...data].sort(
          (a, b) =>
            (a.displayOrder ?? 0) -
            (b.displayOrder ?? 0)
        );

        setStats(sortedStats);

        setCounts(
          sortedStats.map(() => 0)
        );

      } catch (error) {

        console.error(
          "Failed to load about stats:",
          error
        );

        setStats([]);
        setCounts([]);

      }

    };

    fetchStats();

  }, []);


  // =====================================================
  // COUNTER ANIMATION
  // =====================================================

  useEffect(() => {

    if (stats.length === 0) {
      return;
    }

    const duration = 1800;

    const startTime =
      performance.now();

    let animationFrame;


    const animate = (currentTime) => {

      const progress =
        Math.min(
          (currentTime - startTime) /
            duration,
          1
        );


      // Smooth ease-out

      const easeOut =
        1 -
        Math.pow(
          1 - progress,
          3
        );


      setCounts(
        stats.map((stat) =>
          Math.floor(
            (stat.value ?? 0) *
              easeOut
          )
        )
      );


      if (progress < 1) {

        animationFrame =
          requestAnimationFrame(
            animate
          );

      }

    };


    animationFrame =
      requestAnimationFrame(
        animate
      );


    return () => {

      cancelAnimationFrame(
        animationFrame
      );

    };

  }, [stats]);


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="about-intro">


      {/* =================================================
          MAIN INTRO
      ================================================= */}

      <div className="about-intro-main">


        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="about-intro-content">


          <p className="about-intro-eyebrow">
            ABOUT US
          </p>


          <h1>
            WE ARE
            <br />
            MANIFESSTO STUDIOS
          </h1>


          <div className="about-intro-line"></div>


          <p className="about-intro-text">
            We combine storytelling,
            strategy, design and technology
            to create work that people notice
            and brands can grow from.
          </p>


          <p className="about-intro-text">
            Whether it’s a single reel, a
            complete Instagram campaign, a
            cinematic brand film or a website —
            we focus on creating work that looks
            great, communicates clearly and
            delivers purpose.
          </p>


          <p className="about-intro-highlight">
            A CREATIVE STUDIO BUILT FOR
            MODERN BRANDS.
          </p>


        </div>


        {/* =================================================
            RIGHT IMAGE
        ================================================= */}

        <div className="about-intro-image-wrapper">


          <img
            src="/src/assets/images/logo-white.png"
            alt="Manifessto Studios production"
            className="about-intro-image"
          />


          <div className="about-intro-image-overlay"></div>


        </div>


      </div>


      {/* =================================================
          STATS
      ================================================= */}

      {stats.length > 0 && (

        <div className="about-intro-stats">

          {stats.map((stat, index) => (

            <div
              className="about-stat"
              key={stat.id}
            >

              <div className="about-stat-number">

                <strong>
                  {counts[index] ?? 0}
                </strong>

                <span>
                  {stat.suffix}
                </span>

              </div>


              <span className="about-stat-label">
                {stat.label}
              </span>


            </div>

          ))}

        </div>

      )}

    </section>

  );

};

export default AboutIntro;