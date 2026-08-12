import { useEffect, useState } from "react";

import "./AboutStatsManagement.css";


const API_URL =
  "http://localhost:8080/api/about-stats";


const EMPTY_FORM = {
  statKey: "",
  value: "",
  suffix: "+",
  label: "",
  displayOrder: "",
};


const AboutStatsManagement = () => {

  const [stats, setStats] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingStat, setEditingStat] =
    useState(null);

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {

    return localStorage.getItem(
      "adminToken"
    );

  };


  // =====================================================
  // FETCH STATS
  // =====================================================

  const fetchStats = async () => {

    setLoading(true);

    setError("");

    try {

      const response =
        await fetch(API_URL);

      if (!response.ok) {

        throw new Error(
          `Failed to load about stats (${response.status})`
        );

      }

      const data =
        await response.json();

      const sortedStats =
        Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
            )
          : [];

      setStats(sortedStats);

    } catch (err) {

      console.error(
        "Fetch about stats error:",
        err
      );

      setError(
        err.message ||
          "Unable to load about stats."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchStats();

  }, []);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));

    setError("");

    setSuccess("");

  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setFormData(
      EMPTY_FORM
    );

    setEditingStat(null);

    setShowForm(false);

    setError("");

  };


  // =====================================================
  // ADD
  // =====================================================

  const handleAddClick = () => {

    setEditingStat(null);

    setFormData({

      statKey: "",

      value: "",

      suffix: "+",

      label: "",

      displayOrder:
        stats.length + 1,

    });

    setShowForm(true);

    setError("");

    setSuccess("");

  };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (stat) => {

    setEditingStat(stat);

    setFormData({

      statKey:
        stat.statKey || "",

      value:
        stat.value ?? "",

      suffix:
        stat.suffix || "+",

      label:
        stat.label || "",

      displayOrder:
        stat.displayOrder ?? "",

    });

    setShowForm(true);

    setError("");

    setSuccess("");

  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setSaving(true);

    setError("");

    setSuccess("");


    // ===================================================
    // TOKEN
    // ===================================================

    const token = getToken();

    if (!token) {

      setError(
        "Your admin session has expired. Please login again."
      );

      setSaving(false);

      return;

    }


    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !formData.statKey.trim()
    ) {

      setError(
        "Stat key is required."
      );

      setSaving(false);

      return;

    }


    if (
      formData.value === "" ||
      Number.isNaN(
        Number(formData.value)
      )
    ) {

      setError(
        "Please enter a valid value."
      );

      setSaving(false);

      return;

    }


    if (
      !formData.label.trim()
    ) {

      setError(
        "Label is required."
      );

      setSaving(false);

      return;

    }


    const payload = {

      statKey:
        formData.statKey.trim(),

      value:
        Number(formData.value),

      suffix:
        formData.suffix.trim(),

      label:
        formData.label.trim(),

      displayOrder:
        Number(
          formData.displayOrder
        ),

    };


    const isEditing =
      editingStat !== null;


    const url =
      isEditing
        ? `${API_URL}/${editingStat.id}`
        : API_URL;


    const method =
      isEditing
        ? "PUT"
        : "POST";


    // ===================================================
    // REQUEST
    // ===================================================

    try {

      const response =
        await fetch(
          url,
          {

            method,

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify(
                payload
              ),

          }
        );


      // =================================================
      // AUTH ERROR
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        throw new Error(
          "You are not authorized. Please login again."
        );

      }


      // =================================================
      // OTHER ERROR
      // =================================================

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Failed to ${
              isEditing
                ? "update"
                : "create"
            } about stat.`
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        isEditing
          ? "About stat updated successfully."
          : "About stat created successfully."
      );


      resetForm();

      await fetchStats();

    } catch (err) {

      console.error(
        "Save about stat error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this stat?"
      );


    if (!confirmed) {

      return;

    }


    const token = getToken();


    if (!token) {

      setError(
        "Your admin session has expired. Please login again."
      );

      return;

    }


    setDeletingId(id);

    setError("");

    setSuccess("");


    try {

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {

            method: "DELETE",

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }
        );


      // =================================================
      // AUTH ERROR
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        throw new Error(
          "You are not authorized. Please login again."
        );

      }


      // =================================================
      // OTHER ERROR
      // =================================================

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to delete about stat."
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        "About stat deleted successfully."
      );


      await fetchStats();

    } catch (err) {

      console.error(
        "Delete about stat error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete about stat."
      );

    } finally {

      setDeletingId(null);

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="about-stats-management">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="about-stats-management-header">

        <div>

          <p className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h2>
            About Stats
          </h2>

          <p>
            Manage the statistics displayed
            on the About page.
          </p>

        </div>


        <button
          type="button"
          className="add-about-stat-button"
          onClick={
            handleAddClick
          }
        >

          <span>
            +
          </span>

          Add Stat

        </button>

      </div>


      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (

        <div className="about-stats-success">

          {success}

        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="about-stats-error">

          {error}

        </div>

      )}


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="about-stat-form-wrapper">


          <div className="about-stat-form-header">

            <div>

              <p className="admin-section-eyebrow">

                {editingStat
                  ? "EDIT STAT"
                  : "NEW STAT"}

              </p>

              <h3>

                {editingStat
                  ? "Edit About Stat"
                  : "Add About Stat"}

              </h3>

            </div>


            <button
              type="button"
              className="about-stat-close-button"
              onClick={resetForm}
              disabled={saving}
            >
              ×
            </button>

          </div>


          <form
            className="about-stat-form"
            onSubmit={
              handleSubmit
            }
          >


            {/* STAT KEY */}

            <div className="about-stat-form-group">

              <label>
                Stat Key
              </label>

              <input
                type="text"
                name="statKey"
                value={
                  formData.statKey
                }
                onChange={
                  handleChange
                }
                placeholder="clients"
                disabled={
                  saving
                }
              />

            </div>


            {/* VALUE */}

            <div className="about-stat-form-group">

              <label>
                Value
              </label>

              <input
                type="number"
                name="value"
                min="0"
                value={
                  formData.value
                }
                onChange={
                  handleChange
                }
                placeholder="50"
                disabled={
                  saving
                }
              />

            </div>


            {/* SUFFIX */}

            <div className="about-stat-form-group">

              <label>
                Suffix
              </label>

              <input
                type="text"
                name="suffix"
                value={
                  formData.suffix
                }
                onChange={
                  handleChange
                }
                placeholder="+"
                disabled={
                  saving
                }
              />

            </div>


            {/* DISPLAY ORDER */}

            <div className="about-stat-form-group">

              <label>
                Display Order
              </label>

              <input
                type="number"
                name="displayOrder"
                min="1"
                value={
                  formData.displayOrder
                }
                onChange={
                  handleChange
                }
                disabled={
                  saving
                }
              />

            </div>


            {/* LABEL */}

            <div className="about-stat-form-group about-stat-form-full">

              <label>
                Label
              </label>

              <input
                type="text"
                name="label"
                value={
                  formData.label
                }
                onChange={
                  handleChange
                }
                placeholder="Clients"
                disabled={
                  saving
                }
              />

            </div>


            {/* ACTIONS */}

            <div className="about-stat-form-actions">

              <button
                type="button"
                className="about-stat-cancel-button"
                onClick={
                  resetForm
                }
                disabled={
                  saving
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="about-stat-save-button"
                disabled={
                  saving
                }
              >

                {saving
                  ? "Saving..."
                  : editingStat
                    ? "Update Stat"
                    : "Add Stat"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =================================================
          LIST
      ================================================= */}

      <div className="about-stats-list-section">


        <div className="about-stats-list-header">

          <div>

            <p className="admin-section-eyebrow">
              CURRENT STATS
            </p>

            <h3>
              About Page Statistics
            </h3>

          </div>


          <span className="about-stats-count">

            {stats.length} STATS

          </span>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="about-stats-loading">
            Loading statistics...
          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          stats.length === 0 && (

            <div className="about-stats-empty">

              <div className="about-stats-empty-icon">
                #
              </div>

              <h3>
                No statistics yet
              </h3>

              <p>
                Add your first statistic
                for the About page.
              </p>

              <button
                type="button"
                onClick={
                  handleAddClick
                }
              >
                Add First Stat
              </button>

            </div>

          )}


        {/* TABLE */}

        {!loading &&
          stats.length > 0 && (

            <div className="about-stats-table">


              {/* HEADER */}

              <div className="about-stat-table-header">

                <span>
                  STAT
                </span>

                <span>
                  LABEL
                </span>

                <span>
                  ORDER
                </span>

                <span>
                  ACTIONS
                </span>

              </div>


              {/* ROWS */}

              {stats.map(
                (stat) => (

                  <div
                    className="about-stat-row"
                    key={stat.id}
                  >


                    <div className="about-stat-preview">

                      <strong>
                        {stat.value}
                      </strong>

                      <span>
                        {stat.suffix}
                      </span>

                    </div>


                    <div className="about-stat-info">

                      <h4>
                        {stat.label}
                      </h4>

                      <span>
                        {stat.statKey}
                      </span>

                    </div>


                    <div className="about-stat-order">

                      {String(
                        stat.displayOrder ??
                          0
                      ).padStart(
                        2,
                        "0"
                      )}

                    </div>


                    <div className="about-stat-actions">


                      <button
                        type="button"
                        className="about-stat-edit-button"
                        onClick={() =>
                          handleEdit(
                            stat
                          )
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="about-stat-delete-button"
                        onClick={() =>
                          handleDelete(
                            stat.id
                          )
                        }
                        disabled={
                          deletingId ===
                          stat.id
                        }
                      >

                        {deletingId ===
                        stat.id
                          ? "Deleting..."
                          : "Delete"}

                      </button>


                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </section>

  );

};


export default AboutStatsManagement;