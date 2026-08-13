import {
  useEffect,
  useRef,
  useState,
} from "react";

import api from "../../../services/api";

import "./OurTeam.css";

const OurTeam = () => {

  const teamSliderRef = useRef(null);

  const [teamMembers, setTeamMembers] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  // =====================================================
  // PARSE SOCIAL LINKS
  // =====================================================

  const getSocialLinks = (member) => {

    /*
     * NEW CUSTOM SOCIAL LINKS
     */

    if (member.socialLinks) {

      try {

        const parsed =
          JSON.parse(member.socialLinks);

        if (
          Array.isArray(parsed)
        ) {

          const validLinks =
            parsed.filter(
              (item) =>
                item &&
                item.platform &&
                item.url &&
                item.url.trim()
            );

          if (
            validLinks.length > 0
          ) {

            return validLinks;
          }
        }

      } catch (error) {

        console.error(
          "Invalid social links:",
          error
        );
      }
    }

    /*
     * OLD INSTAGRAM / LINKEDIN
     *
     * This keeps old database records
     * working.
     */

    const oldLinks = [];

    if (member.instagram) {

      oldLinks.push({
        platform: "instagram",
        url: member.instagram,
      });

    }

    if (member.linkedin) {

      oldLinks.push({
        platform: "linkedin",
        url: member.linkedin,
      });

    }

    return oldLinks;
  };


  // =====================================================
  // SOCIAL ICON
  // =====================================================

  const getSocialIcon = (platform) => {

    switch (
      platform
        ?.toLowerCase()
        .trim()
    ) {

      case "instagram":
        return "◎";

      case "linkedin":
        return "in";

      case "youtube":
        return "▶";

      case "facebook":
        return "f";

      case "twitter":
      case "x":
        return "𝕏";

      case "website":
        return "↗";

      case "behance":
        return "Be";

      case "dribbble":
        return "Dr";

      default:
        return "↗";
    }
  };


  // =====================================================
  // FETCH ALL TEAM MEMBERS
  // =====================================================

  useEffect(() => {

    const fetchTeamMembers =
      async () => {

        try {

          const response =
            await api.get(
              "/team-members"
            );

          const data =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];

          const sortedMembers =
            [...data].sort(
              (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
            );

          setTeamMembers(
            sortedMembers
          );

        } catch (error) {

          console.error(
            "Failed to load team members:",
            error
          );

          setTeamMembers([]);

        }

      };

    fetchTeamMembers();

  }, []);


  // =====================================================
  // NEXT CARD
  // =====================================================

  const scrollToNext = () => {

    if (!teamSliderRef.current) {
      return;
    }

    const slider =
      teamSliderRef.current;

    const cards =
      slider.querySelectorAll(
        ".public-team-card"
      );

    if (!cards.length) {
      return;
    }

    const currentScroll =
      slider.scrollLeft;

    let nextCard = null;

    for (
      const card of cards
    ) {

      if (
        card.offsetLeft >
        currentScroll + 30
      ) {

        nextCard = card;

        break;
      }
    }

    if (nextCard) {

      slider.scrollTo({
        left:
          nextCard.offsetLeft,

        behavior:
          "smooth",
      });

    } else {

      slider.scrollTo({
        left: 0,

        behavior:
          "smooth",
      });

    }
  };


  // =====================================================
  // MOUSE WHEEL
  // =====================================================

  const handleWheel = (event) => {

    if (!teamSliderRef.current) {
      return;
    }

    const slider =
      teamSliderRef.current;

    /*
     * Only convert vertical mouse-wheel
     * movement into horizontal card movement.
     *
     * This is desktop mouse behavior.
     * It does NOT handle mobile touch.
     */

    if (
      Math.abs(event.deltaY) >
      Math.abs(event.deltaX)
    ) {

      event.preventDefault();

      slider.scrollLeft +=
        event.deltaY * 1.2;

    } else {

      slider.scrollLeft +=
        event.deltaX;

    }
  };


  // =====================================================
  // MOUSE DRAG START
  // =====================================================

  const handleMouseDown = (event) => {

    if (!teamSliderRef.current) {
      return;
    }

    const slider =
      teamSliderRef.current;

    setIsDragging(true);

    dragStartX.current =
      event.pageX;

    dragStartScrollLeft.current =
      slider.scrollLeft;
  };


  // =====================================================
  // MOUSE DRAG MOVE
  // =====================================================

  const handleMouseMove = (event) => {

    if (!isDragging) {
      return;
    }

    if (!teamSliderRef.current) {
      return;
    }

    const slider =
      teamSliderRef.current;

    const distance =
      event.pageX -
      dragStartX.current;

    slider.scrollLeft =
      dragStartScrollLeft.current -
      distance * 1.2;
  };


  // =====================================================
  // MOUSE DRAG END
  // =====================================================

  const handleMouseUp = () => {

    setIsDragging(false);

  };


  const handleMouseLeave = () => {

    setIsDragging(false);

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="our-team">


      {/* =================================================
          LEFT INTRO
      ================================================= */}

      <div className="our-team-intro">

        <p className="our-team-eyebrow">
          OUR TEAM
        </p>


        <h2>
          THE PEOPLE
          <br />
          BEHIND THE WORK.
        </h2>


        <div className="our-team-line"></div>


        <p className="our-team-description">
          A team of creators, storytellers and thinkers
          who love turning ideas into powerful visual
          stories.
        </p>

      </div>


      {/* =================================================
          TEAM SLIDER
      ================================================= */}

      <div className="our-team-slider-area">

        <div
          ref={teamSliderRef}
          className={`our-team-slider ${
            isDragging
              ? "is-dragging"
              : ""
          }`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onDragStart={(event) =>
            event.preventDefault()
          }
        >


          {teamMembers.map(
            (member) => (

              <article
                className="public-team-card"
                key={member.id}
              >


                {/* =========================================
                    IMAGE
                ========================================= */}

                <div className="public-team-card-image-wrapper">

                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="public-team-card-image"
                    draggable="false"
                  />


                  <div className="public-team-card-image-overlay"></div>


                  <span className="public-team-card-number">

                    {String(
                      member.displayOrder ?? 0
                    ).padStart(
                      2,
                      "0"
                    )}

                  </span>

                </div>


                {/* =========================================
                    CONTENT
                ========================================= */}

                <div className="public-team-card-content">

                  <h3>
                    {member.name}
                  </h3>


                  <p className="public-team-card-role">
                    {member.role}
                  </p>


                  <p className="public-team-card-description">
                    {member.description}
                  </p>


                  {/* =======================================
                      SOCIAL
                  ======================================= */}

                  {getSocialLinks(
                    member
                  ).length > 0 && (

                    <div className="public-team-card-social">

                      {getSocialLinks(
                        member
                      ).map(
                        (
                          social,
                          index
                        ) => (

                          <a
                            key={
                              `${social.platform}-${index}`
                            }
                            href={
                              social.url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={
                              `${member.name} ${social.platform}`
                            }
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >

                            {getSocialIcon(
                              social.platform
                            )}

                          </a>

                        )
                      )}

                    </div>

                  )}

                </div>

              </article>

            )
          )}

        </div>


        {/* =================================================
            MORE BUTTON
        ================================================= */}

        {teamMembers.length > 0 && (

          <button
            type="button"
            className="team-more-button"
            onClick={scrollToNext}
            aria-label="View next team member"
          >

            <span className="team-more-label">
              MORE
            </span>


            <span className="team-more-arrow">
              →
            </span>

          </button>

        )}


        {/* =================================================
            SCROLL HINT
        ================================================= */}

        {teamMembers.length > 0 && (

          <div className="team-scroll-hint">

            <span className="team-scroll-hint-line"></span>

            <span>
              DRAG TO EXPLORE
            </span>

          </div>

        )}

      </div>

    </section>
  );
};

export default OurTeam;