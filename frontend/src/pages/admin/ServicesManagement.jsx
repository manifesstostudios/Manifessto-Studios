import { useEffect, useState } from "react";
import "./ServicesManagement.css";

const API_URL = "http://localhost:8080/api/services";
const UPLOAD_API_URL = "http://localhost:8080/api/uploads/image";

const EMPTY_FORM = {
  icon: "",
  title: "",
  shortTitle: "",
  description: "",
  imageUrl: "",
  displayOrder: "",
};

const ServicesManagement = ({
  onManageItems,
}) => {

  const [services, setServices] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingService, setEditingService] =
    useState(null);

  const [formData, setFormData] =
    useState({
      ...EMPTY_FORM,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
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
  // FETCH SERVICES
  // =====================================================

  const fetchServices = async () => {

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load services (${response.status})`
        );
      }

      const data =
        await response.json();

      const sortedServices =
        Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                Number(
                  a.displayOrder ?? 0
                ) -
                Number(
                  b.displayOrder ?? 0
                )
            )
          : [];

      setServices(sortedServices);

    } catch (err) {

      console.error(
        "Fetch services error:",
        err
      );

      setError(
        err.message ||
          "Unable to load services."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchServices();

  }, []);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");
    setSuccess("");
  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setFormData({
      ...EMPTY_FORM,
    });

    setEditingService(null);

    setShowForm(false);

    setError("");
    setSuccess("");
  };


  // =====================================================
  // ADD SERVICE
  // =====================================================

  const handleAddClick = () => {

    setEditingService(null);

    setFormData({
      ...EMPTY_FORM,

      displayOrder:
        services.length + 1,
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };


  // =====================================================
  // IMAGE UPLOAD TO CLOUDINARY
  // =====================================================

  const handleImageUpload = async (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");


    // =================================================
    // FILE TYPE
    // =================================================

    if (!file.type.startsWith("image/")) {

      setError(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }


    // =================================================
    // FILE SIZE
    // =================================================

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {

      setError(
        "Image size must be less than 10 MB."
      );

      event.target.value = "";

      return;
    }


    // =================================================
    // TOKEN
    // =================================================

    const token =
      getToken();

    if (!token) {

      setError(
        "Your admin session has expired. Please login again."
      );

      event.target.value = "";

      return;
    }


    setUploadingImage(true);


    try {

      const uploadData =
        new FormData();

      uploadData.append(
        "image",
        file
      );


      /*
       * IMPORTANT:
       * Do NOT manually set Content-Type.
       * Browser automatically adds multipart boundary.
       */

      const response =
        await fetch(
          UPLOAD_API_URL,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: uploadData,
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
          "You are not authorized to upload images. Please login again."
        );
      }


      // =================================================
      // UPLOAD ERROR
      // =================================================

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Image upload failed (${response.status}).`
        );
      }


      // =================================================
      // RESPONSE
      // =================================================

      const data =
        await response.json();


      if (!data.url) {

        throw new Error(
          "Image uploaded but no URL was returned."
        );
      }


      // =================================================
      // SAVE CLOUDINARY URL IN FORM
      // =================================================

      setFormData(
        (previous) => ({
          ...previous,
          imageUrl: data.url,
        })
      );


      setSuccess(
        "Image uploaded successfully."
      );

    } catch (err) {

      console.error(
        "Cloudinary upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload image."
      );

    } finally {

      setUploadingImage(false);

      // Allow same image to be selected again
      event.target.value = "";
    }
  };


  // =====================================================
  // CREATE / UPDATE SERVICE
  // =====================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    const token =
      getToken();


    if (!token) {

      setError(
        "Your admin session has expired. Please login again."
      );

      return;
    }


    if (uploadingImage) {

      setError(
        "Please wait until the image upload is complete."
      );

      return;
    }


    const icon =
      formData.icon.trim();

    const title =
      formData.title.trim();

    const shortTitle =
      formData.shortTitle.trim();

    const description =
      formData.description.trim();

    const imageUrl =
      formData.imageUrl.trim();

    const displayOrder =
      Number(
        formData.displayOrder
      );


    // =================================================
    // VALIDATION
    // =================================================

    if (!icon) {

      setError(
        "Icon is required."
      );

      return;
    }


    if (!title) {

      setError(
        "Service title is required."
      );

      return;
    }


    if (!shortTitle) {

      setError(
        "Short title is required."
      );

      return;
    }


    if (!description) {

      setError(
        "Description is required."
      );

      return;
    }


    if (!imageUrl) {

      setError(
        "Please upload a service image."
      );

      return;
    }


    if (
      !Number.isInteger(
        displayOrder
      ) ||
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
      editingService !== null;


    const url =
      isEditing
        ? `${API_URL}/${editingService.id}`
        : API_URL;


    const method =
      isEditing
        ? "PUT"
        : "POST";


    const payload = {

      icon,

      title,

      shortTitle,

      description,

      imageUrl,

      displayOrder,
    };


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
            } service.`
        );
      }


      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        isEditing
          ? "Service updated successfully."
          : "Service created successfully."
      );


      setFormData({
        ...EMPTY_FORM,
      });

      setEditingService(null);

      setShowForm(false);


      await fetchServices();

    } catch (err) {

      console.error(
        "Save service error:",
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
  // EDIT SERVICE
  // =====================================================

  const handleEdit = (
    service
  ) => {

    setEditingService(service);

    setFormData({

      icon:
        service.icon || "",

      title:
        service.title || "",

      shortTitle:
        service.shortTitle || "",

      description:
        service.description || "",

      imageUrl:
        service.imageUrl || "",

      displayOrder:
        service.displayOrder ?? "",
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };


  // =====================================================
  // REMOVE IMAGE FROM FORM
  // =====================================================

  const handleRemoveImage = () => {

    setFormData(
      (previous) => ({
        ...previous,
        imageUrl: "",
      })
    );

    setError("");
    setSuccess("");
  };


  // =====================================================
  // DELETE SERVICE
  // =====================================================

  const handleDelete = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this service? All service items under this service will also be deleted."
      );


    if (!confirmed) {
      return;
    }


    const token =
      getToken();


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
            "Failed to delete service."
        );
      }


      setSuccess(
        "Service deleted successfully."
      );


      await fetchServices();

    } catch (err) {

      console.error(
        "Delete service error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete service."
      );

    } finally {

      setDeletingId(null);
    }
  };


  // =====================================================
  // MANAGE ITEMS
  // =====================================================

  const handleManageItems = (
    service
  ) => {

    if (
      typeof onManageItems ===
      "function"
    ) {

      onManageItems(service);
    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="services-management">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="services-management-header">

        <div>

          <p className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h2>
            Services
          </h2>

          <p>
            Manage the services displayed on
            the Manifessto Studios website.
          </p>

        </div>


        <button
          type="button"
          className="add-service-button"
          onClick={handleAddClick}
        >

          <span>
            +
          </span>

          <span>
            Add Service
          </span>

        </button>

      </div>


      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (

        <div className="service-success-message">
          {success}
        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="service-error-message">
          {error}
        </div>

      )}


      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (

        <div className="service-form-wrapper">


          {/* FORM HEADER */}

          <div className="service-form-header">

            <div>

              <p className="admin-section-eyebrow">
                {editingService
                  ? "EDIT SERVICE"
                  : "NEW SERVICE"}
              </p>

              <h3>
                {editingService
                  ? "Edit Service"
                  : "Add Service"}
              </h3>

            </div>


            <button
              type="button"
              className="close-service-form"
              onClick={resetForm}
              disabled={
                saving ||
                uploadingImage
              }
            >
              ×
            </button>

          </div>


          {/* FORM */}

          <form
            className="service-form"
            onSubmit={handleSubmit}
          >


            {/* ICON */}

            <div className="service-form-group">

              <label htmlFor="service-icon">
                Icon
              </label>

              <input
                id="service-icon"
                name="icon"
                type="text"
                placeholder="🎬"
                value={
                  formData.icon
                }
                onChange={
                  handleChange
                }
                required
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>


            {/* TITLE */}

            <div className="service-form-group">

              <label htmlFor="service-title">
                Title
              </label>

              <input
                id="service-title"
                name="title"
                type="text"
                placeholder="PRODUCTION"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                required
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>


            {/* SHORT TITLE */}

            <div className="service-form-group">

              <label htmlFor="service-short-title">
                Short Title
              </label>

              <input
                id="service-short-title"
                name="shortTitle"
                type="text"
                placeholder="Production"
                value={
                  formData.shortTitle
                }
                onChange={
                  handleChange
                }
                required
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>


            {/* DISPLAY ORDER */}

            <div className="service-form-group">

              <label htmlFor="service-order">
                Display Order
              </label>

              <input
                id="service-order"
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
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>


            {/* DESCRIPTION */}

            <div className="service-form-group service-form-full">

              <label htmlFor="service-description">
                Description
              </label>

              <textarea
                id="service-description"
                name="description"
                rows="5"
                placeholder="Enter service description..."
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                required
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>


            {/* =================================================
                CLOUDINARY IMAGE UPLOAD
            ================================================= */}

            <div className="service-form-group service-form-full">

              <label>
                Service Image
              </label>


              <div className="service-image-upload-box">


                {/* UPLOAD TOP */}

                <div className="service-image-upload-top">

                  <div className="service-image-upload-info">

                    <strong>
                      Upload Service Image
                    </strong>

                    <p>
                      Select an image from your
                      computer and upload it to
                      Cloudinary.
                    </p>

                  </div>


                  <label
                    htmlFor="service-image-file"
                    className={
                      uploadingImage
                        ? "service-image-upload-button uploading"
                        : "service-image-upload-button"
                    }
                  >

                    {uploadingImage
                      ? "Uploading..."
                      : "Choose Image"}

                  </label>


                  <input
                    id="service-image-file"
                    className="service-image-file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={
                      handleImageUpload
                    }
                    disabled={
                      saving ||
                      uploadingImage
                    }
                  />

                </div>


                {/* IMAGE PREVIEW */}

                {formData.imageUrl && (

                  <div className="service-image-preview">

                    <img
                      src={
                        formData.imageUrl
                      }
                      alt={
                        formData.title ||
                        "Service preview"
                      }
                    />


                    <div className="service-image-preview-info">

                      <span className="service-image-upload-success">
                        ✓ Image uploaded successfully
                      </span>

                      <small>
                        Cloudinary image is ready.
                      </small>


                      <button
                        type="button"
                        className="service-remove-image-button"
                        onClick={
                          handleRemoveImage
                        }
                        disabled={
                          saving ||
                          uploadingImage
                        }
                      >
                        Remove Image
                      </button>

                    </div>

                  </div>

                )}


                {/* HELP */}

                {!formData.imageUrl && (

                  <div className="service-image-upload-help">

                    <span>
                      JPG / JPEG / PNG / WEBP
                    </span>

                    <span>
                      Maximum 10 MB
                    </span>

                  </div>

                )}

              </div>

            </div>


            {/* ACTIONS */}

            <div className="service-form-actions">

              <button
                type="button"
                className="cancel-service-button"
                onClick={resetForm}
                disabled={
                  saving ||
                  uploadingImage
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="save-service-button"
                disabled={
                  saving ||
                  uploadingImage
                }
              >

                {uploadingImage
                  ? "Uploading Image..."
                  : saving
                    ? "Saving..."
                    : editingService
                      ? "Update Service"
                      : "Create Service"}

              </button>

            </div>


          </form>

        </div>

      )}


      {/* =================================================
          SERVICES LIST
      ================================================= */}

      <div className="services-list-section">


        <div className="services-list-header">

          <div>

            <p className="admin-section-eyebrow">
              ALL SERVICES
            </p>

            <h3>
              Services
            </h3>

          </div>


          <span className="services-count">

            {services.length}

            {" "}

            {services.length === 1
              ? "Service"
              : "Services"}

          </span>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="services-empty">

            <span className="services-empty-icon">
              ◈
            </span>

            <h3>
              Loading services...
            </h3>

            <p>
              Fetching services from the database.
            </p>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          services.length === 0 && (

            <div className="services-empty">

              <span className="services-empty-icon">
                ◈
              </span>

              <h3>
                No services yet
              </h3>

              <p>
                Add your first service to start
                managing your services.
              </p>

              <button
                type="button"
                onClick={
                  handleAddClick
                }
              >
                + Add Service
              </button>

            </div>

          )}


        {/* SERVICES */}

        {!loading &&
          services.length > 0 && (

            <div className="services-table">

              {services.map(
                (service) => (

                  <article
                    className="service-admin-card"
                    key={service.id}
                  >


                    {/* ORDER */}

                    <div className="service-admin-order">

                      {String(
                        service.displayOrder ??
                          0
                      ).padStart(
                        2,
                        "0"
                      )}

                    </div>


                    {/* IMAGE */}

                    <div className="service-admin-image">

                      {service.imageUrl ? (

                        <img
                          src={
                            service.imageUrl
                          }
                          alt={
                            service.title
                          }
                        />

                      ) : (

                        <span>
                          {service.icon}
                        </span>

                      )}

                    </div>


                    {/* INFO */}

                    <div className="service-admin-info">

                      <h4>
                        {service.title}
                      </h4>

                      <span>
                        {service.shortTitle}
                      </span>

                      <p>
                        {service.description}
                      </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="service-admin-actions">

                      <button
                        type="button"
                        className="manage-items-button"
                        onClick={() =>
                          handleManageItems(
                            service
                          )
                        }
                      >
                        Manage Items
                      </button>


                      <button
                        type="button"
                        className="edit-service-button"
                        onClick={() =>
                          handleEdit(
                            service
                          )
                        }
                        disabled={
                          deletingId ===
                          service.id
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="delete-service-button"
                        onClick={() =>
                          handleDelete(
                            service.id
                          )
                        }
                        disabled={
                          deletingId ===
                          service.id
                        }
                      >

                        {deletingId ===
                        service.id
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


export default ServicesManagement;