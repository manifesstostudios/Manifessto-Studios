import "./OurProcess.css";

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "We understand your brand and goals.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6" />
        <path d="M16 16L21 21" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Plan",
    description: "We plan the perfect strategy for you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M9 7H15" />
        <path d="M9 11H15" />
        <path d="M9 15H13" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Shoot",
    description: "We capture magic through our lens.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 8.5C4 7.67 4.67 7 5.5 7H8L9.5 5H14.5L16 7H18.5C19.33 7 20 7.67 20 8.5V18C20 18.83 19.33 19.5 18.5 19.5H5.5C4.67 19.5 4 18.83 4 18V8.5Z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Edit",
    description: "We edit and craft your story.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 20L9 19L19 9C20.1 7.9 20.1 6.1 19 5C17.9 3.9 16.1 3.9 15 5L5 15L4 20Z" />
        <path d="M13.5 6.5L17.5 10.5" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Deliver",
    description: "We deliver content that drives results.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 11L21 3L14 21L11 14L3 11Z" />
        <path d="M11 14L21 3" />
      </svg>
    ),
  },
];

const OurProcess = () => {
  return (
    <section className="process-section">
      <div className="process-container">

        {/* =========================
            HEADING
        ========================= */}

        <div className="process-heading">
          <p className="process-eyebrow">
            OUR PROCESS
          </p>

          <h2>
            How We Work
          </h2>
        </div>


        {/* =========================
            TIMELINE
        ========================= */}

        <div className="process-timeline">

          {/* Connecting Line */}
          <div className="process-line"></div>


          {/* Percentage Labels */}

          <div className="process-progress-labels">

            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>

          </div>


          {/* Process Steps */}

          <div className="process-steps">

            {processSteps.map((step) => (
              <div
                className="process-step"
                key={step.number}
              >

                {/* Number */}

                <span className="process-number">
                  {step.number}
                </span>


                {/* Icon */}

                <div className="process-icon">
                  {step.icon}
                </div>


                {/* Content */}

                <div className="process-content">

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default OurProcess;