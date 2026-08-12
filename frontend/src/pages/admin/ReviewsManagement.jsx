import { useEffect, useState } from "react";

import api from "../../services/api";

import "./ReviewsManagement.css";


const EMPTY_FORM = {
  name: "",
  role: "",
  rating: 5,
  review: "",
  displayOrder: 1,
  active: true,
};


const ReviewsManagement = () => {

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [editingReview, setEditingReview] =
    useState(null);

  const [formData, setFormData] =
    useState({
      ...EMPTY_FORM,
    });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =====================================================
  // FETCH REVIEWS
  // =====================================================

  const fetchReviews = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/reviews");

      const data =
        Array.isArray(response.data)
          ? response.data
          : [];

      const sortedReviews =
        [...data].sort(
          (a, b) =>
            (a.displayOrder ?? 0) -
            (b.displayOrder ?? 0)
        );

      setReviews(sortedReviews);

    } catch (err) {

      console.error(
        "Failed to load reviews:",
        err
      );

      setError(
        "Unable to load reviews."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchReviews();

  }, []);


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");

    setSuccess("");

  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddReview = () => {

    setEditingReview(null);

    setFormData({
      ...EMPTY_FORM,

      displayOrder:
        reviews.length + 1,

    });

    setShowForm(true);

    setError("");

    setSuccess("");

  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEditReview = (review) => {

    setEditingReview(review);

    setFormData({

      name:
        review.name || "",

      role:
        review.role || "",

      rating:
        review.rating ?? 5,

      review:
        review.review || "",

      displayOrder:
        review.displayOrder ?? 1,

      active:
        review.active ?? true,

    });

    setShowForm(true);

    setError("");

    setSuccess("");

  };


  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCloseForm = () => {

    setShowForm(false);

    setEditingReview(null);

    setFormData({
      ...EMPTY_FORM,
    });

    setError("");

  };


  // =====================================================
  // SAVE REVIEW
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    const name =
      formData.name.trim();

    const role =
      formData.role.trim();

    const reviewText =
      formData.review.trim();

    const rating =
      Number(formData.rating);

    const displayOrder =
      Number(formData.displayOrder);


    // =================================================
    // VALIDATION
    // =================================================

    if (!name) {

      setError(
        "Client name is required."
      );

      return;

    }


    if (!role) {

      setError(
        "Client role is required."
      );

      return;

    }


    if (!reviewText) {

      setError(
        "Review text is required."
      );

      return;

    }


    if (
      rating < 1 ||
      rating > 5
    ) {

      setError(
        "Rating must be between 1 and 5."
      );

      return;

    }


    if (
      !Number.isInteger(displayOrder) ||
      displayOrder < 1
    ) {

      setError(
        "Display order must be a positive number."
      );

      return;

    }


    const payload = {

      name,

      role,

      rating,

      review:
        reviewText,

      displayOrder,

      active:
        Boolean(formData.active),

    };


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      // =================================================
      // UPDATE
      // =================================================

      if (editingReview) {

        const response =
          await api.put(
            `/reviews/${editingReview.id}`,
            payload
          );


        setReviews((previous) =>
          previous
            .map((item) =>
              item.id ===
              editingReview.id
                ? response.data
                : item
            )
            .sort(
              (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
            )
        );


        setSuccess(
          "Review updated successfully."
        );

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        const response =
          await api.post(
            "/reviews",
            payload
          );


        setReviews((previous) =>
          [
            ...previous,
            response.data,
          ].sort(
            (a, b) =>
              (a.displayOrder ?? 0) -
              (b.displayOrder ?? 0)
          )
        );


        setSuccess(
          "Review added successfully."
        );

      }


      handleCloseForm();

    } catch (err) {

      console.error(
        "Failed to save review:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        setError(
          "You are not authorized to manage reviews."
        );

      } else {

        setError(
          err.response?.data?.message ||
          "Unable to save review."
        );

      }

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // DELETE REVIEW
  // =====================================================

  const handleDeleteReview = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this review?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(id);

      setError("");

      setSuccess("");


      await api.delete(
        `/reviews/${id}`
      );


      setReviews((previous) =>
        previous.filter(
          (review) =>
            review.id !== id
        )
      );


      setSuccess(
        "Review deleted successfully."
      );

    } catch (err) {

      console.error(
        "Failed to delete review:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        setError(
          "You are not authorized to delete reviews."
        );

      } else {

        setError(
          err.response?.data?.message ||
          "Unable to delete review."
        );

      }

    } finally {

      setDeletingId(null);

    }

  };


  // =====================================================
  // TOGGLE ACTIVE
  // =====================================================

  const handleToggleActive = async (review) => {

    try {

      setError("");

      setSuccess("");


      const payload = {

        name:
          review.name,

        role:
          review.role,

        rating:
          review.rating,

        review:
          review.review,

        displayOrder:
          review.displayOrder,

        active:
          !review.active,

      };


      const response =
        await api.put(
          `/reviews/${review.id}`,
          payload
        );


      setReviews((previous) =>
        previous
          .map((item) =>
            item.id === review.id
              ? response.data
              : item
          )
          .sort(
            (a, b) =>
              (a.displayOrder ?? 0) -
              (b.displayOrder ?? 0)
          )
      );


      setSuccess(
        response.data.active
          ? "Review activated."
          : "Review hidden."
      );

    } catch (err) {

      console.error(
        "Failed to update review status:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to update review status."
      );

    }

  };


  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name) => {

    if (!name) {
      return "?";
    }

    return name
      .trim()
      .split(/\s+/)
      .map(
        (word) =>
          word.charAt(0)
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();

  };


  // =====================================================
  // RATING STARS
  // =====================================================

  const renderStars = (rating) => {

    return (
      <div className="admin-review-rating">

        {[1, 2, 3, 4, 5].map(
          (star) => (

            <span
              key={star}
              className={
                star <= rating
                  ? "admin-review-star active"
                  : "admin-review-star"
              }
            >
              ★
            </span>

          )
        )}

      </div>
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="reviews-management">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="reviews-management-header">

        <div>

          <p className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h2>
            Reviews
          </h2>

          <p>
            Manage client reviews displayed
            on your website.
          </p>

        </div>


        <button
          type="button"
          className="admin-add-review-btn"
          onClick={handleAddReview}
        >

          <span>
            +
          </span>

          <span>
            Add Review
          </span>

        </button>

      </div>


      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (

        <div className="admin-review-success">
          {success}
        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="admin-review-error">
          {error}
        </div>

      )}


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="admin-review-form-card">


          <div className="admin-review-form-header">

            <div>

              <p className="admin-section-eyebrow">

                {editingReview
                  ? "EDIT REVIEW"
                  : "NEW REVIEW"}

              </p>

              <h3>

                {editingReview
                  ? "Edit Review"
                  : "Add Review"}

              </h3>

            </div>


            <button
              type="button"
              className="admin-review-close-btn"
              onClick={handleCloseForm}
              disabled={saving}
            >
              ×
            </button>

          </div>


          <form
            className="admin-review-form"
            onSubmit={handleSubmit}
          >


            {/* NAME */}

            <div className="admin-review-form-group">

              <label>
                Client Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Client name"
                disabled={saving}
                required
              />

            </div>


            {/* ROLE */}

            <div className="admin-review-form-group">

              <label>
                Client Role
              </label>

              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Founder / Client / Manager"
                disabled={saving}
                required
              />

            </div>


            {/* RATING */}

            <div className="admin-review-form-group">

              <label>
                Rating
              </label>

              <div className="admin-rating-selector">

                {[1, 2, 3, 4, 5].map(
                  (rating) => (

                    <button
                      type="button"
                      key={rating}
                      className={
                        rating <=
                        Number(
                          formData.rating
                        )
                          ? "admin-rating-star selected"
                          : "admin-rating-star"
                      }
                      onClick={() =>
                        setFormData(
                          (previous) => ({
                            ...previous,
                            rating,
                          })
                        )
                      }
                      disabled={saving}
                    >
                      ★
                    </button>

                  )
                )}

              </div>

            </div>


            {/* DISPLAY ORDER */}

            <div className="admin-review-form-group">

              <label>
                Display Order
              </label>

              <input
                type="number"
                name="displayOrder"
                value={
                  formData.displayOrder
                }
                onChange={handleChange}
                min="1"
                step="1"
                disabled={saving}
                required
              />

            </div>


            {/* REVIEW */}

            <div className="admin-review-form-group full">

              <label>
                Review
              </label>

              <textarea
                name="review"
                rows="5"
                value={formData.review}
                onChange={handleChange}
                placeholder="Write the client review..."
                disabled={saving}
                required
              />

            </div>


            {/* ACTIVE */}

            <div className="admin-review-options">

              <label className="admin-review-checkbox">

                <input
                  type="checkbox"
                  name="active"
                  checked={
                    formData.active
                  }
                  onChange={handleChange}
                  disabled={saving}
                />

                <span>
                  Show this review on website
                </span>

              </label>

            </div>


            {/* ACTIONS */}

            <div className="admin-review-form-actions">

              <button
                type="button"
                className="admin-review-cancel-btn"
                onClick={handleCloseForm}
                disabled={saving}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="admin-review-save-btn"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingReview
                  ? "Update Review"
                  : "Add Review"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =================================================
          REVIEWS LIST
      ================================================= */}

      <div className="admin-reviews-list-card">


        <div className="admin-reviews-list-header">

          <div>

            <p className="admin-section-eyebrow">
              ALL REVIEWS
            </p>

            <h3>
              Client Feedback
            </h3>

          </div>


          <span className="admin-review-count">

            {reviews.length}

            {" "}

            {reviews.length === 1
              ? "Review"
              : "Reviews"}

          </span>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="admin-reviews-empty">

            <span>
              ◎
            </span>

            <h3>
              Loading reviews...
            </h3>

            <p>
              Fetching reviews from database.
            </p>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          reviews.length === 0 && (

            <div className="admin-reviews-empty">

              <span>
                ★
              </span>

              <h3>
                No reviews yet
              </h3>

              <p>
                Add your first client review.
              </p>

              <button
                type="button"
                onClick={handleAddReview}
              >
                + Add Review
              </button>

            </div>

          )}


        {/* REVIEWS */}

        {!loading &&
          reviews.length > 0 && (

            <div className="admin-reviews-list">

              {reviews.map(
                (review) => (

                  <article
                    className="admin-review-item"
                    key={review.id}
                  >


                    {/* ORDER */}

                    <div className="admin-review-order">

                      {String(
                        review.displayOrder ??
                        0
                      ).padStart(
                        2,
                        "0"
                      )}

                    </div>


                    {/* AVATAR */}

                    <div className="admin-review-avatar">

                      {getInitials(
                        review.name
                      )}

                    </div>


                    {/* MAIN */}

                    <div className="admin-review-main">

                      <div className="admin-review-client">

                        <h4>
                          {review.name}
                        </h4>

                        <span>
                          {review.role}
                        </span>

                      </div>


                      {renderStars(
                        review.rating
                      )}


                      <p className="admin-review-text">

                        "{review.review}"

                      </p>

                    </div>


                    {/* STATUS */}

                    <div className="admin-review-status">

                      <button
                        type="button"
                        className={
                          review.active
                            ? "admin-status active"
                            : "admin-status inactive"
                        }
                        onClick={() =>
                          handleToggleActive(
                            review
                          )
                        }
                      >

                        {review.active
                          ? "Active"
                          : "Hidden"}

                      </button>

                    </div>


                    {/* ACTIONS */}

                    <div className="admin-review-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEditReview(
                            review
                          )
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          handleDeleteReview(
                            review.id
                          )
                        }
                        disabled={
                          deletingId ===
                          review.id
                        }
                      >

                        {deletingId ===
                        review.id
                          ? "Deleting..."
                          : "Delete"}

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

      </div>

    </section>

  );

};


export default ReviewsManagement;