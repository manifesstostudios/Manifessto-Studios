import { useEffect, useState } from "react";

import api from "../../services/api";

import "./Reviews.css";


const Reviews = () => {

  const [reviews, setReviews] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [showAll, setShowAll] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    review: "",
    rating: 5,
  });


  // =========================
  // FETCH REVIEWS
  // =========================

  useEffect(() => {

    const fetchReviews = async () => {

      try {

        const response = await api.get("/reviews");

        setReviews(response.data);

      } catch (error) {

        console.error(
          "Failed to load reviews:",
          error
        );

      }

    };


    fetchReviews();

  }, []);


  // =========================
  // GENERATE INITIALS
  // =========================

  const getInitials = (name) => {

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
  // SUBMIT REVIEW
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (
      !formData.name.trim() ||
      !formData.review.trim()
    ) {
      return;
    }


    try {

      const newReview = {

        name: formData.name.trim(),

        role: "Client",

        rating: Number(formData.rating),

        review: formData.review.trim(),

        displayOrder: reviews.length + 1,

        active: true,

      };


      const response = await api.post(
        "/reviews",
        newReview
      );


      // Immediately show newly submitted review

      setReviews((prev) => [
        ...prev,
        response.data,
      ]);


      // Reset form

      setFormData({
        name: "",
        review: "",
        rating: 5,
      });


      setShowModal(false);


    } catch (error) {

      console.error(
        "Failed to submit review:",
        error
      );

    }

  };


  // =========================
  // VISIBLE REVIEWS
  // =========================

  const visibleReviews = showAll
    ? reviews
    : reviews.slice(0, 6);


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
              onClick={() => setShowModal(true)}
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


          {visibleReviews.map(
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
                          review.rating
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
                      {review.role}
                    </p>

                  </div>

                </div>

              </div>

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
          onClick={() =>
            setShowModal(false)
          }
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
                onClick={() =>
                  setShowModal(false)
                }
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
                  required
                />

              </div>


              {/* Submit */}

              <button
                type="submit"
                className="submit-review-btn"
              >

                <span>
                  Submit Review
                </span>

                <span>
                  →
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