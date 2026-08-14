import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <main className="legal-page">
      <div className="legal-container">

        <div className="legal-header">
          <p className="legal-eyebrow">LEGAL</p>

          <h1>
            PRIVACY
            <br />
            <span>POLICY.</span>
          </h1>

          <div className="legal-line"></div>

          <p className="legal-intro">
            Your privacy matters to us. This Privacy Policy explains
            how Manifessto Studios collects, uses and protects your
            information when you use our website or contact us.
          </p>
        </div>

        <div className="legal-content">

          <section>
            <h2>1. Information We Collect</h2>
            <p>
              When you contact us, request a project, or submit an
              inquiry, we may collect information such as your name,
              phone number, email address, project requirements and
              other information you voluntarily provide.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information you provide to respond to your
              inquiries, understand your project requirements,
              communicate with you and provide our services.
            </p>
          </section>

          <section>
            <h2>3. Information Protection</h2>
            <p>
              We take reasonable measures to protect the information
              shared with us from unauthorized access, misuse or
              disclosure.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>
              Our website may use third-party services for hosting,
              analytics, communication or other functionality. These
              services may process information according to their own
              privacy policies.
            </p>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>
              Our website may use cookies or similar technologies to
              improve website functionality and user experience.
            </p>
          </section>

          <section>
            <h2>6. Your Choices</h2>
            <p>
              You may contact us if you have questions about the
              information we hold about you or if you want to request
              correction or deletion of information where applicable.
            </p>
          </section>

          <section>
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy,
              you can contact Manifessto Studios at:
            </p>

            <a
              href="mailto:manifesstostudios@gmail.com"
              className="legal-email"
            >
              manifesstostudios@gmail.com
            </a>
          </section>

          <div className="legal-updated">
            Last updated: August 2026
          </div>

        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;