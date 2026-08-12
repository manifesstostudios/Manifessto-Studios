import { useEffect, useState } from "react";
import "./TrustedBrandsManagement.css";

const API_URL = "http://localhost:8080/api/trusted-by";

const EMPTY_FORM = {
  name: "",
  displayOrder: "",
  active: true,
};

const TrustedBrandsManagement = () => {

  const [brands, setBrands] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingBrand, setEditingBrand] =
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
    return localStorage.getItem("adminToken");
  };


  // =====================================================
  // FETCH BRANDS
  // =====================================================

  const fetchBrands = async () => {

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(API_URL);

      if (!response.ok) {

        throw new Error(
          `Failed to load trusted brands (${response.status})`
        );
      }

      const data =
        await response.json();

      const sortedBrands =
        Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
            )
          : [];

      setBrands(sortedBrands);

    } catch (err) {

      console.error(
        "Fetch trusted brands error:",
        err
      );

      setError(
        err.message ||
          "Unable to load trusted brands."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchBrands();

  }, []);


  // =====================================================
  // INPUT CHANGE
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
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setFormData(EMPTY_FORM);

    setEditingBrand(null);

    setShowForm(false);

    setError("");
    setSuccess("");
  };


  // =====================================================
  // ADD BRAND
  // =====================================================

  const handleAddClick = () => {

    setEditingBrand(null);

    setFormData({
      name: "",
      displayOrder:
        brands.length + 1,
      active: true,
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    const token = getToken();

    if (!token) {

      setError(
        "Your admin session has expired. Please login again."
      );

      return;
    }

    const name =
      formData.name.trim();

    const displayOrder =
      Number(formData.displayOrder);


    // =================================================
    // VALIDATION
    // =================================================

    if (!name) {

      setError(
        "Brand name is required."
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


    setSaving(true);
    setError("");
    setSuccess("");


    const payload = {
      name,
      displayOrder,
      active: Boolean(
        formData.active
      ),
    };


    const isEditing =
      editingBrand !== null;


    const url = isEditing
      ? `${API_URL}/${editingBrand.id}`
      : API_URL;

    const method = isEditing
      ? "PUT"
      : "POST";


    try {

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(payload),
        });


      if (
        response.status === 401 ||
        response.status === 403
      ) {

        throw new Error(
          "You are not authorized. Please login again."
        );
      }


      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Failed to ${
              isEditing
                ? "update"
                : "create"
            } trusted brand.`
        );
      }


      setSuccess(
        isEditing
          ? "Trusted brand updated successfully."
          : "Trusted brand created successfully."
      );


      resetForm();

      await fetchBrands();

    } catch (err) {

      console.error(
        "Save trusted brand error:",
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
  // EDIT
  // =====================================================

  const handleEdit = (brand) => {

    setEditingBrand(brand);

    setFormData({
      name:
        brand.name || "",

      displayOrder:
        brand.displayOrder ?? "",

      active:
        brand.active ?? true,
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this trusted brand?"
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


      if (
        response.status === 401 ||
        response.status === 403
      ) {

        throw new Error(
          "You are not authorized. Please login again."
        );
      }


      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to delete trusted brand."
        );
      }


      setSuccess(
        "Trusted brand deleted successfully."
      );


      await fetchBrands();

    } catch (err) {

      console.error(
        "Delete trusted brand error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete trusted brand."
      );

    } finally {

      setDeletingId(null);
    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="trusted-brands-management">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="trusted-brands-header">

        <div>

          <p className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h2>
            Trusted By
          </h2>

          <p>
            Manage the brands displayed in the
            Trusted By section of the website.
          </p>

        </div>


        <button
          type="button"
          className="add-trusted-brand-button"
          onClick={handleAddClick}
        >

          <span>
            +
          </span>

          <span>
            Add Brand
          </span>

        </button>

      </div>


      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (

        <div className="trusted-brand-success">
          {success}
        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="trusted-brand-error">
          {error}
        </div>

      )}


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="trusted-brand-form-wrapper">


          <div className="trusted-brand-form-header">

            <div>

              <p className="admin-section-eyebrow">

                {editingBrand
                  ? "EDIT BRAND"
                  : "NEW BRAND"}

              </p>

              <h3>

                {editingBrand
                  ? "Edit Trusted Brand"
                  : "Add Trusted Brand"}

              </h3>

            </div>


            <button
              type="button"
              className="trusted-brand-close-button"
              onClick={resetForm}
              disabled={saving}
            >
              ×
            </button>

          </div>


          <form
            className="trusted-brand-form"
            onSubmit={handleSubmit}
          >


            {/* BRAND NAME */}

            <div className="trusted-brand-form-group">

              <label htmlFor="trusted-brand-name">
                Brand Name
              </label>

              <input
                id="trusted-brand-name"
                name="name"
                type="text"
                placeholder="LG"
                value={formData.name}
                onChange={handleChange}
                maxLength={255}
                required
                disabled={saving}
              />

            </div>


            {/* DISPLAY ORDER */}

            <div className="trusted-brand-form-group">

              <label htmlFor="trusted-brand-order">
                Display Order
              </label>

              <input
                id="trusted-brand-order"
                name="displayOrder"
                type="number"
                min="1"
                step="1"
                placeholder="1"
                value={
                  formData.displayOrder
                }
                onChange={handleChange}
                required
                disabled={saving}
              />

            </div>


            {/* ACTIVE */}

            <div className="trusted-brand-active-group">

              <label
                className="trusted-brand-checkbox-label"
              >

                <input
                  type="checkbox"
                  name="active"
                  checked={
                    Boolean(
                      formData.active
                    )
                  }
                  onChange={handleChange}
                  disabled={saving}
                />

                <span>
                  Active
                </span>

              </label>

              <small>
                Active brands are displayed
                on the public website.
              </small>

            </div>


            {/* ACTIONS */}

            <div className="trusted-brand-form-actions">

              <button
                type="button"
                className="trusted-brand-cancel-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="trusted-brand-save-button"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingBrand
                    ? "Update Brand"
                    : "Create Brand"}

              </button>

            </div>

          </form>

        </div>
      )}


      {/* =================================================
          LIST
      ================================================= */}

      <div className="trusted-brands-list-section">


        <div className="trusted-brands-list-header">

          <div>

            <p className="admin-section-eyebrow">
              ALL BRANDS
            </p>

            <h3>
              Trusted Brands
            </h3>

          </div>


          <span className="trusted-brands-count">

            {brands.length}

            {" "}

            {brands.length === 1
              ? "Brand"
              : "Brands"}

          </span>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="trusted-brands-empty">

            <span>
              ◈
            </span>

            <h3>
              Loading brands...
            </h3>

            <p>
              Fetching trusted brands from
              the database.
            </p>

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          brands.length === 0 && (

            <div className="trusted-brands-empty">

              <span>
                ◈
              </span>

              <h3>
                No trusted brands yet
              </h3>

              <p>
                Add the first brand to your
                Trusted By section.
              </p>

              <button
                type="button"
                onClick={handleAddClick}
              >
                + Add Brand
              </button>

            </div>

          )}


        {/* =================================================
            BRANDS
        ================================================= */}

        {!loading &&
          brands.length > 0 && (

            <div className="trusted-brands-table">

              {brands.map((brand) => (

                <article
                  className="trusted-brand-card"
                  key={brand.id}
                >

                  {/* ORDER */}

                  <div className="trusted-brand-order">

                    {String(
                      brand.displayOrder
                    ).padStart(2, "0")}

                  </div>


                  {/* NAME */}

                  <div className="trusted-brand-name">

                    {brand.name}

                  </div>


                  {/* STATUS */}

                  <div
                    className={`trusted-brand-status ${
                      brand.active
                        ? "active"
                        : "inactive"
                    }`}
                  >

                    {brand.active
                      ? "Active"
                      : "Inactive"}

                  </div>


                  {/* ACTIONS */}

                  <div className="trusted-brand-actions">

                    <button
                      type="button"
                      className="trusted-brand-edit-button"
                      onClick={() =>
                        handleEdit(brand)
                      }
                      disabled={
                        deletingId ===
                        brand.id
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="trusted-brand-delete-button"
                      onClick={() =>
                        handleDelete(
                          brand.id
                        )
                      }
                      disabled={
                        deletingId ===
                        brand.id
                      }
                    >

                      {deletingId ===
                      brand.id
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

      </div>

    </section>
  );
};


export default TrustedBrandsManagement;