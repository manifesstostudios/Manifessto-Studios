import { useEffect, useState } from "react";
import "./ServiceItemsManagement.css";

const API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/api`;

const EMPTY_FORM = {
  itemName: "",
  displayOrder: "",
};

const ServiceItemsManagement = ({
  service,
  onBack,
}) => {

  // =====================================================
  // STATE
  // =====================================================

  const [items, setItems] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

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
  // GET ADMIN TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem(
      "adminToken"
    );
  };


  // =====================================================
  // HANDLE AUTH ERROR
  // =====================================================

  const handleAuthError = () => {

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminEmail"
    );

    setError(
      "Your admin session has expired. Please login again."
    );
  };


  // =====================================================
  // FETCH SERVICE ITEMS
  // =====================================================

  const fetchItems = async () => {

    if (!service?.id) {

      setItems([]);

      setLoading(false);

      return;
    }

    setLoading(true);

    setError("");

    try {

      const response = await fetch(
        `${API_BASE_URL}/services/${service.id}/items`
      );


      // GET is public according to our
      // current backend SecurityConfig.

      if (!response.ok) {

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          handleAuthError();
          return;
        }

        throw new Error(
          `Failed to load service items (${response.status})`
        );
      }


      const data = await response.json();


      const sortedItems = Array.isArray(data)
        ? [...data].sort(
            (a, b) =>
              Number(a.displayOrder ?? 0) -
              Number(b.displayOrder ?? 0)
          )
        : [];


      setItems(sortedItems);

    } catch (err) {

      console.error(
        "Fetch service items error:",
        err
      );

      setError(
        err.message ||
          "Unable to load service items."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // LOAD ITEMS WHEN SERVICE CHANGES
  // =====================================================

  useEffect(() => {

    setShowForm(false);

    setEditingItem(null);

    setFormData(EMPTY_FORM);

    setError("");

    setSuccess("");

    fetchItems();

  }, [service?.id]);


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

    setFormData(EMPTY_FORM);

    setEditingItem(null);

    setShowForm(false);

    setError("");

    setSuccess("");
  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddClick = () => {

    setEditingItem(null);

    setFormData({
      itemName: "",
      displayOrder: items.length + 1,
    });

    setShowForm(true);

    setError("");

    setSuccess("");
  };


  // =====================================================
  // SUBMIT ADD / UPDATE
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


    if (!service?.id) {

      setError(
        "Service information is missing."
      );

      return;
    }


    const itemName =
      formData.itemName.trim();


    const displayOrder =
      Number(formData.displayOrder);


    // =================================================
    // VALIDATION
    // =================================================

    if (!itemName) {

      setError(
        "Item name is required."
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


    const isEditing =
      editingItem !== null;


    const url = isEditing

      ? `${API_BASE_URL}/service-items/${editingItem.id}`

      : `${API_BASE_URL}/services/${service.id}/items`;


    const method = isEditing
      ? "PUT"
      : "POST";


    const payload = {
      itemName,
      displayOrder,
    };


    try {

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
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

        handleAuthError();

        return;
      }


      // =================================================
      // OTHER ERROR
      // =================================================

      if (!response.ok) {

        let message =
          `Failed to ${
            isEditing
              ? "update"
              : "create"
          } service item.`;


        try {

          const errorData =
            await response.json();

          if (errorData?.message) {
            message =
              errorData.message;
          }

        } catch {
          // Ignore JSON parsing error
        }


        throw new Error(message);
      }


      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        isEditing
          ? "Service item updated successfully."
          : "Service item created successfully."
      );


      setFormData(
        EMPTY_FORM
      );

      setEditingItem(null);

      setShowForm(false);


      await fetchItems();

    } catch (err) {

      console.error(
        "Save service item error:",
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
  // EDIT ITEM
  // =====================================================

  const handleEdit = (item) => {

    setEditingItem(item);

    setFormData({
      itemName:
        item.itemName || "",

      displayOrder:
        item.displayOrder ?? "",
    });

    setShowForm(true);

    setError("");

    setSuccess("");
  };


  // =====================================================
  // DELETE ITEM
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this service item?"
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

      const response = await fetch(
        `${API_BASE_URL}/service-items/${id}`,
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

        handleAuthError();

        return;
      }


      // =================================================
      // DELETE ERROR
      // =================================================

      if (!response.ok) {

        let message =
          "Failed to delete service item.";


        try {

          const errorData =
            await response.json();

          if (errorData?.message) {
            message =
              errorData.message;
          }

        } catch {
          // Ignore JSON parsing error
        }


        throw new Error(message);
      }


      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        "Service item deleted successfully."
      );


      // If currently editing the deleted item,
      // close the form.

      if (
        editingItem?.id === id
      ) {

        setEditingItem(null);

        setShowForm(false);

        setFormData(
          EMPTY_FORM
        );
      }


      await fetchItems();

    } catch (err) {

      console.error(
        "Delete service item error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete service item."
      );

    } finally {

      setDeletingId(null);
    }
  };


  // =====================================================
  // BACK TO SERVICES
  // =====================================================

  const handleBack = () => {

    resetForm();

    if (onBack) {
      onBack();
    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="service-items-management">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="service-items-header">


        <div className="service-items-header-left">


          <button
            type="button"
            className="service-items-back-button"
            onClick={handleBack}
          >
            ← Back to Services
          </button>


          <p className="admin-section-eyebrow">
            SERVICE ITEMS
          </p>


          <h2>
            {service?.title ||
              "Service"}
          </h2>


          <p>
            Manage the individual services
            offered under this category.
          </p>


        </div>


        <button
          type="button"
          className="add-service-item-button"
          onClick={handleAddClick}
        >

          <span>
            +
          </span>

          <span>
            Add Item
          </span>

        </button>


      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (

        <div className="service-item-success">

          {success}

        </div>

      )}


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <div className="service-item-error">

          {error}

        </div>

      )}


      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (

        <div className="service-item-form-wrapper">


          {/* FORM HEADER */}

          <div className="service-item-form-header">


            <div>

              <p className="admin-section-eyebrow">

                {editingItem
                  ? "EDIT ITEM"
                  : "NEW ITEM"}

              </p>


              <h3>

                {editingItem
                  ? "Edit Service Item"
                  : "Add Service Item"}

              </h3>

            </div>


            <button
              type="button"
              className="service-item-close-button"
              onClick={resetForm}
              disabled={saving}
            >
              ×
            </button>


          </div>


          {/* FORM */}

          <form
            className="service-item-form"
            onSubmit={handleSubmit}
          >


            {/* ITEM NAME */}

            <div className="service-item-form-group">


              <label htmlFor="item-name">
                Item Name
              </label>


              <input
                id="item-name"
                name="itemName"
                type="text"
                placeholder="Videography"
                value={
                  formData.itemName
                }
                onChange={
                  handleChange
                }
                maxLength={255}
                required
                disabled={saving}
              />


            </div>


            {/* DISPLAY ORDER */}

            <div className="service-item-form-group">


              <label htmlFor="item-order">
                Display Order
              </label>


              <input
                id="item-order"
                name="displayOrder"
                type="number"
                min="1"
                step="1"
                placeholder="1"
                value={
                  formData.displayOrder
                }
                onChange={
                  handleChange
                }
                required
                disabled={saving}
              />


            </div>


            {/* FORM ACTIONS */}

            <div className="service-item-form-actions">


              <button
                type="button"
                className="service-item-cancel-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="service-item-save-button"
                disabled={saving}
              >

                {saving

                  ? "Saving..."

                  : editingItem

                    ? "Update Item"

                    : "Create Item"}

              </button>


            </div>


          </form>


        </div>

      )}


      {/* =================================================
          ITEMS LIST
      ================================================= */}

      <div className="service-items-list-section">


        {/* LIST HEADER */}

        <div className="service-items-list-header">


          <div>

            <p className="admin-section-eyebrow">
              ALL ITEMS
            </p>


            <h3>
              {service?.shortTitle ||
                service?.title ||
                "Service Items"}
            </h3>

          </div>


          <span className="service-items-count">

            {items.length}

            {" "}

            {items.length === 1
              ? "Item"
              : "Items"}

          </span>


        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="service-items-empty">

            <span>
              ◈
            </span>


            <h3>
              Loading items...
            </h3>


            <p>
              Fetching service items from
              the database.
            </p>

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          items.length === 0 && (

            <div className="service-items-empty">


              <span>
                ◈
              </span>


              <h3>
                No service items yet
              </h3>


              <p>
                Add the first item for this
                service.
              </p>


              <button
                type="button"
                onClick={
                  handleAddClick
                }
              >
                + Add Item
              </button>


            </div>

          )}


        {/* =================================================
            ITEMS
        ================================================= */}

        {!loading &&
          items.length > 0 && (

            <div className="service-items-table">


              {items.map((item) => (

                <article
                  className="service-item-card"
                  key={item.id}
                >


                  {/* ORDER */}

                  <div className="service-item-order">

                    {String(
                      item.displayOrder
                    ).padStart(2, "0")}

                  </div>


                  {/* NAME */}

                  <div className="service-item-name">

                    {item.itemName}

                  </div>


                  {/* ACTIONS */}

                  <div className="service-item-actions">


                    <button
                      type="button"
                      className="service-item-edit-button"
                      onClick={() =>
                        handleEdit(item)
                      }
                      disabled={
                        deletingId ===
                        item.id
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="service-item-delete-button"
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      disabled={
                        deletingId ===
                        item.id
                      }
                    >

                      {deletingId ===
                      item.id

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


export default ServiceItemsManagement;