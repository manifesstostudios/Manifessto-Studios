import "./Founders.css";

import founderImage from "../../assets/images/founder.jpeg";
import cofounderImage from "../../assets/images/cofounder.jpeg";

const founders = [
  {
    id: "01",
    role: "FOUNDER",
    name: "Atharva Maind",
    image: "https://res.cloudinary.com/cihmo4w9/image/upload/v1786634083/manifessto-studios/sfbspdmklgujbkefo7zo.jpg",

    description:
      "Creative and detail-oriented Videographer experienced in producing brand shoots, promotional reels, and wedding content. Skilled in operating professional cameras, camera gimbals, and mobile gimbals to capture smooth, cinematic visuals. Strong understanding of composition, lighting, and visual storytelling to create engaging and high-quality content. Have collaborated with brands such as LG, Yogesh Marketing, My Home Decor, and Hotel Airport Centre Point, delivering impactful videos for digital platforms and social media. Passionate about bringing creative ideas to life through compelling visuals, with the ability to manage shoots from concept to final output while maintaining professional quality and meeting project deadlines ",

    position: "Founder • Manifessto Studios",

    skills: ["Photography", "Direction", "Creative Strategy"],

    reverse: false,
  },

  {
    id: "02",
    role: "CO-FOUNDER",
    name: "Abhishek Kashte",
    image: "https://res.cloudinary.com/cihmo4w9/image/upload/v1786633984/manifessto-studios/wur8chq7urya4g3sqnei.jpg",

    description:
      "Creative Photographer and Videographer with a passion for turning ideas into meaningful visual stories. Skilled in photography, cinematic videography, reel production, composition, lighting, and creative direction, with a focus on creating visuals that feel authentic and intentional. I also bring experience in graphic design, including posters, thumbnails, carousels, banners, branding, and visual creatives. As a co-founder of Manifesto Studio, I combine creativity, visual strategy, and attention to detail to help brands communicate their identity through powerful imagery and storytelling.",

    position: "Co-Founder • Manifessto Studios",

    skills: ["Videography", "Editing", "Brand Storytelling"],

    reverse: true,
  },
];

const Founders = () => {
  return (
    <section className="founders-section">

      <div className="founders-container">

        {/* =========================
            HEADING
        ========================= */}

        <div className="founders-heading">

          <p className="founders-eyebrow">
            THE PEOPLE BEHIND THE LENS
          </p>

          <h2>
            Meet the Founders
          </h2>

          <p className="founders-intro">
            The creative minds behind Manifesto Studio,
            turning ideas into stories that connect.
          </p>

        </div>


        {/* =========================
            FOUNDERS
        ========================= */}

        <div className="founders-list">

          {founders.map((founder) => (

            <article
              className={`founder-card ${
                founder.reverse ? "founder-card-reverse" : ""
              }`}
              key={founder.id}
            >

              {/* =========================
                  IMAGE
              ========================= */}

              <div className="founder-image-wrapper">

                <img
                  src={founder.image}
                  alt={founder.name}
                  className="founder-image"
                />

                <div className="founder-image-overlay"></div>

                <span className="founder-number">
                  {founder.id}
                </span>

              </div>


              {/* =========================
                  CONTENT
              ========================= */}

              <div className="founder-content">

                <div className="founder-top">

                  <p className="founder-role">
                    {founder.role}
                  </p>

                  <h3>
                    {founder.name}
                  </h3>

                  <div className="founder-line"></div>

                  <p className="founder-description">
                    {founder.description}
                  </p>

                </div>


                {/* =========================
                    BOTTOM INFO
                ========================= */}

                <div className="founder-bottom">

                  <p className="founder-position">
                    {founder.position}
                  </p>

                  <div className="founder-skills">

                    {founder.skills.map((skill) => (

                      <span
                        className="founder-skill"
                        key={skill}
                      >
                        {skill}
                      </span>

                    ))}

                  </div>

                </div>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Founders;