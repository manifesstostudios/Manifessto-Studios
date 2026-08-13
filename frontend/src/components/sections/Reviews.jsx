import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    review: "",
    rating: 5,
  });

  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // FETCH REVIEWS
  // =========================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get("/reviews");

        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          setReviews([]);
          console.error(
            "Unexpected reviews response:",
            response.data
          );
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
        console.error("Response:", error.response?.data);
        console.error("Status:", error.response?.status);
        console.error("URL:", error.config?.url);

        setErrorMessage(
          "Unable to load reviews right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // =========================
  // GENERATE INITIALS
  // =========================

  const getInitials = (name) => {
    if (!name) {
      return "?";
    }

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // =========================
  // RATING
  // =========================

  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  // =========================
  // OPEN MODAL
  // =========================

  const handleOpenModal = () => {
    setErrorMessage("");
    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const handleCloseModal = () => {
    if (submitting) {
      return;
    }

    setShowModal(false);
    setErrorMessage("");
  };

  // =========================
  // SUBMIT REVIEW
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    const name = formData.name.trim();
    const reviewText = formData.review.trim();

    // =========================
    // VALIDATION
    // =========================

    if (!name) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!reviewText) {
      setErrorMessage("Please enter your review.");
      return;
    }

    if (
      Number(formData.rating) < 1 ||
      Number(formData.rating) > 5
    ) {
      setErrorMessage("Please select a valid rating.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      // =========================
      // REQUEST DATA
      // =========================

      const newReview = {
        name: name,
        role: "Client",
        rating: Number(formData.rating),
        review: reviewText,

        // Keep same structure as your backend
        displayOrder: reviews.length + 1,

        // Backend also forces this to true
        active: true,
      };

      console.log(
        "Submitting review:",
        newReview
      );

      // =========================
      // POST REVIEW
      // =========================

      const response = await api.post(
        "/reviews",
        newReview
      );

      console.log(
        "Review submitted successfully:",
        response.data
      );

      // =========================
      // ADD RESPONSE TO UI
      // =========================

      if (response.data) {
        setReviews((prev) => [
          ...prev,
          response.data,
        ]);
      }

      // =========================
      // RESET FORM
      // =========================

      setFormData({
        name: "",
        review: "",
        rating: 5,
      });

      // =========================
      // CLOSE MODAL
      // =========================

      setShowModal(false);

    } catch (error) {
      // =========================
      // DETAILED ERROR
      // =========================

      console.error(
        "================================"
      );

      console.error(
        "FAILED TO SUBMIT REVIEW"
      );

      console.error(
        "Error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "URL:",
        error.config?.url
      );

      console.error(
        "Method:",
        error.config?.method
      );

      console.error(
        "================================"
      );

      // =========================
      // USER FRIENDLY ERROR
      // =========================

      if (!error.response) {
        setErrorMessage(
          "Unable to connect to the server. Please try again."
        );
      } else if (
        error.response.status === 400
      ) {
        setErrorMessage(
          "Invalid review details. Please check your information."
        );
      } else if (
        error.response.status === 401 ||
        error.response.status === 403
      ) {
        setErrorMessage(
          "You are not authorized to submit a review."
        );
      } else if (
        error.response.status === 404
      ) {
        setErrorMessage(
          "Review service is currently unavailable."
        );
      } else if (
        error.response.status >= 500
      ) {
        setErrorMessage(
          "Server error. Please try again later."
        );
      } else {
        setErrorMessage(
          "Failed to submit your review. Please try again."
        );
      }

    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // VISIBLE REVIEWS
  // =========================

  const visibleReviews = showAll
    ? reviews
    : reviews.slice(0, 6);

  // =========================
  // RETURN
  // =========================

  return (
    <section className="reviews-section">

      <div className="reviews-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="reviews-header">

          <div className="reviews-title">

            <p className="reviews-eyebrow">
              WHAT CLIENTS SAY
            </p>

            <h2>
              Reviews
            </h2>

          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="reviews-actions">

            <button
              type="button"
              className="write-review-btn"
              onClick={handleOpenModal}
              disabled={submitting}
            >

              <span>
                Write a Review
              </span>

              <span className="review-arrow">
                ↗
              </span>

            </button>

            {reviews.length > 6 && (

              <button
                type="button"
                className="view-reviews-btn"
                onClick={() =>
                  setShowAll((prev) => !prev)
                }
              >

                <span>
                  {showAll
                    ? "Show Less"
                    : "View All Reviews"}
                </span>

                <span className="view-arrow">
                  {showAll ? "↑" : "→"}
                </span>

              </button>

            )}

          </div>

        </div>

        {/* =========================
            REVIEW GRID
        ========================= */}

        <div className="reviews-grid">

          {loading ? (

            <div className="reviews-loading">
              Loading reviews...
            </div>

          ) : visibleReviews.length === 0 ? (

            <div className="reviews-empty">
              No reviews yet. Be the first to write one.
            </div>

          ) : (

            visibleReviews.map(
              (review) => (

                <div
                  className="review-card"
                  key={review.id}
                >

                  {/* Rating */}

                  <div className="review-rating">

                    {Array.from(
                      { length: 5 },
                      (_, starIndex) => (

                        <span
                          key={starIndex}
                          className={
                            starIndex <
                            Number(review.rating)
                              ? "review-star active"
                              : "review-star"
                          }
                        >
                          ★
                        </span>

                      )
                    )}

                  </div>

                  {/* Review Text */}

                  <p className="review-text">
                    "{review.review}"
                  </p>

                  {/* Client */}

                  <div className="review-client">

                    <div className="review-avatar">

                      {getInitials(
                        review.name
                      )}

                    </div>

                    <div className="review-client-info">

                      <h4>
                        {review.name}
                      </h4>

                      <p>
                        {review.role || "Client"}
                      </p>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

      {/* =========================
          WRITE REVIEW MODAL
      ========================= */}

      {showModal && (

        <div
          className="review-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="review-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="review-modal-header">

              <div>

                <p className="modal-eyebrow">
                  SHARE YOUR EXPERIENCE
                </p>

                <h3>
                  Write a Review
                </h3>

              </div>

              <button
                type="button"
                className="review-close-btn"
                onClick={handleCloseModal}
                disabled={submitting}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <form
              className="review-form"
              onSubmit={handleSubmit}
            >

              {/* Name */}

              <div className="form-group">

                <label htmlFor="review-name">
                  Your Name
                </label>

                <input
                  id="review-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />

              </div>

              {/* Rating */}

              <div className="form-group">

                <label>
                  Your Rating
                </label>

                <div className="rating-selector">

                  {[1, 2, 3, 4, 5].map(
                    (rating) => (

                      <button
                        type="button"
                        key={rating}
                        className={
                          rating <=
                          formData.rating
                            ? "rating-star selected"
                            : "rating-star"
                        }
                        onClick={() =>
                          handleRating(rating)
                        }
                        disabled={submitting}
                        aria-label={`${rating} stars`}
                      >
                        ★
                      </button>

                    )
                  )}

                </div>

              </div>

              {/* Review */}

              <div className="form-group">

                <label htmlFor="review-description">
                  Your Review
                </label>

                <textarea
                  id="review-description"
                  name="review"
                  rows="5"
                  placeholder="Tell us about your experience..."
                  value={formData.review}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />

              </div>

              {/* Error */}

              {errorMessage && (

                <div
                  className="review-error-message"
                  role="alert"
                >
                  {errorMessage}
                </div>

              )}

              {/* Submit */}

              <button
                type="submit"
                className="submit-review-btn"
                disabled={submitting}
              >

                <span>
                  {submitting
                    ? "Submitting..."
                    : "Submit Review"}
                </span>

                <span>
                  {submitting ? "..." : "→"}
                </span>

              </button>

            </form>

          </div>

        </div>

      )}

    </section>
  );
};

export default Reviews;