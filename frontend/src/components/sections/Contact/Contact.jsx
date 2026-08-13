import "./Contact.css";

const Contact = () => {

  return (
    <main className="contact-page">

      {/* =========================
          CONTACT HERO
      ========================= */}

      <section className="contact-hero">

        <div className="contact-hero-content">

          <p className="contact-eyebrow">
            LET'S TALK
          </p>

          <h1>
            HAVE A PROJECT
            <br />
            <span>IN MIND?</span>
          </h1>

          <div className="contact-line"></div>

          <p className="contact-description">
            Whether you have a brand to build, a story to
            tell or an idea you want to bring to life,
            we'd love to hear from you.
          </p>

        </div>

      </section>


      {/* =========================
          CONTACT INFORMATION
      ========================= */}

      <section className="contact-information">

        {/* EMAIL */}

        <div className="contact-item">

          <span className="contact-item-number">
            01
          </span>

          <div>

            <p className="contact-item-label">
              EMAIL
            </p>

            <a
              href="mailto:manifesstostudios@gmail.com"
              className="contact-item-value"
            >
              manifesstostudios@gmail.com
            </a>

          </div>

        </div>


        {/* PHONE */}

        <div className="contact-item">

          <span className="contact-item-number">
            02
          </span>

          <div>

            <p className="contact-item-label">
              PHONE
            </p>

            <div className="contact-phone-list">

              {/* ATHARVA MAIND */}

              <a
                href="tel:+917888156307"
                className="contact-item-value contact-phone-link"
                aria-label="Call Atharva Maind"
              >
                <span className="contact-person-name">
                  Atharva Maind
                </span>

                <span className="contact-phone-number">
                  +91 78881 56307
                </span>
              </a>


              {/* ABHISHEK KASHTE */}

              <a
                href="tel:+919067756648"
                className="contact-item-value contact-phone-link"
                aria-label="Call Abhishek Kashte"
              >
                <span className="contact-person-name">
                  Abhishek Kashte
                </span>

                <span className="contact-phone-number">
                  +91 90677 56648
                </span>
              </a>

            </div>

          </div>

        </div>


        {/* LOCATION */}

        <div className="contact-item">

          <span className="contact-item-number">
            03
          </span>

          <div>

            <p className="contact-item-label">
              LOCATION
            </p>

            <p className="contact-item-value">
              Nagpur, Maharashtra
              <br />
              India
            </p>

          </div>

        </div>


        {/* AVAILABILITY */}

        <div className="contact-item">

          <span className="contact-item-number">
            04
          </span>

          <div>

            <p className="contact-item-label">
              AVAILABILITY
            </p>

            <p className="contact-item-value">
              Monday — Saturday
              <br />
              10:00 AM — 7:00 PM
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="contact-cta">

        <div className="contact-cta-content">

          <p className="contact-cta-eyebrow">
            READY WHEN YOU ARE
          </p>

          <h2>
            LET'S MAKE
            <br />
            <span>SOMETHING GREAT.</span>
          </h2>

          <p className="contact-cta-description">
            Tell us what you're working on and let's
            create something meaningful together.
          </p>

        </div>

      </section>

    </main>
  );
};

export default Contact;