import { useEffect, useState } from "react";
import "./TeamManagement.css";

const API_URL = "http://localhost:8080/api/team-members";
const UPLOAD_API_URL = "http://localhost:8080/api/uploads/image";

const EMPTY_FORM = {
  name: "",
  role: "",
  description: "",
  imageUrl: "",
  instagram: "",
  linkedin: "",
  displayOrder: "",
};

const TeamManagement = () => {
  const [members, setMembers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // =====================================================
  // FETCH MEMBERS
  // =====================================================

  const fetchMembers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load team members (${response.status})`
        );
      }

      const data = await response.json();

      const sortedMembers = Array.isArray(data)
        ? [...data].sort(
            (a, b) =>
              (a.displayOrder ?? 0) -
              (b.displayOrder ?? 0)
          )
        : [];

      setMembers(sortedMembers);
    } catch (err) {
      console.error(
        "Fetch team members error:",
        err
      );

      setError(
        err.message ||
          "Unable to load team members."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchMembers();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    // -----------------------------------------------------
    // FILE TYPE
    // -----------------------------------------------------

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    // -----------------------------------------------------
    // FILE SIZE
    // -----------------------------------------------------

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be less than 10 MB."
      );

      event.target.value = "";
      return;
    }

    // -----------------------------------------------------
    // TOKEN
    // -----------------------------------------------------

    const token = getToken();

    if (!token) {
      setError(
        "Your admin session has expired. Please login again."
      );

      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();

      uploadData.append("image", file);

      // ===================================================
      // IMPORTANT:
      // Authorization header is required because
      // /api/uploads/image is protected by Spring Security.
      // Do NOT manually set Content-Type.
      // ===================================================

      const response = await fetch(
        UPLOAD_API_URL,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: uploadData,
        }
      );

      // ---------------------------------------------------
      // AUTH ERROR
      // ---------------------------------------------------

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "You are not authorized to upload images. Please login again."
        );
      }

      // ---------------------------------------------------
      // OTHER ERROR
      // ---------------------------------------------------

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Image upload failed (${response.status}).`
        );
      }

      // ---------------------------------------------------
      // RESPONSE
      // ---------------------------------------------------

      const data = await response.json();

      if (!data.url) {
        throw new Error(
          "Image uploaded but no image URL was returned."
        );
      }

      // ---------------------------------------------------
      // SAVE CLOUDINARY URL INTO FORM
      // ---------------------------------------------------

      setFormData((previous) => ({
        ...previous,
        imageUrl: data.url,
      }));

      setSuccess(
        "Image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Image upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);

      // Allow selecting the same file again
      event.target.value = "";
    }
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      ...EMPTY_FORM,
    });

    setEditingMember(null);
    setShowForm(false);

    setError("");
    setSuccess("");
  };

  // =====================================================
  // ADD MEMBER
  // =====================================================

  const handleAddClick = () => {
    setEditingMember(null);

    setFormData({
      ...EMPTY_FORM,
      displayOrder: members.length + 1,
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };

  // =====================================================
  // EDIT MEMBER
  // =====================================================

  const handleEdit = (member) => {
    setEditingMember(member);

    setFormData({
      name: member.name || "",
      role: member.role || "",
      description: member.description || "",
      imageUrl: member.imageUrl || "",
      instagram: member.instagram || "",
      linkedin: member.linkedin || "",
      displayOrder:
        member.displayOrder ?? "",
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };

  // =====================================================
  // SUBMIT TEAM MEMBER
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

    // -----------------------------------------------------
    // PREVENT SAVE WHILE IMAGE UPLOAD IS RUNNING
    // -----------------------------------------------------

    if (uploadingImage) {
      setError(
        "Please wait until the image upload is complete."
      );

      return;
    }

    const name = formData.name.trim();
    const role = formData.role.trim();
    const description =
      formData.description.trim();
    const imageUrl =
      formData.imageUrl.trim();
    const instagram =
      formData.instagram.trim();
    const linkedin =
      formData.linkedin.trim();

    const displayOrder = Number(
      formData.displayOrder
    );

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!name) {
      setError(
        "Team member name is required."
      );
      return;
    }

    if (!role) {
      setError(
        "Team member role is required."
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
        "Please upload a profile image."
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

    // =====================================================
    // PAYLOAD
    // =====================================================

    const payload = {
      name,
      role,
      description,
      imageUrl,
      instagram: instagram || null,
      linkedin: linkedin || null,
      displayOrder,
    };

    const isEditing =
      editingMember !== null;

    const url = isEditing
      ? `${API_URL}/${editingMember.id}`
      : API_URL;

    const method = isEditing
      ? "PUT"
      : "POST";

    try {
      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      // ---------------------------------------------------
      // AUTH
      // ---------------------------------------------------

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "You are not authorized. Please login again."
        );
      }

      // ---------------------------------------------------
      // ERROR
      // ---------------------------------------------------

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Failed to ${
              isEditing
                ? "update"
                : "create"
            } team member.`
        );
      }

      // ---------------------------------------------------
      // SUCCESS
      // ---------------------------------------------------

      setSuccess(
        isEditing
          ? "Team member updated successfully."
          : "Team member created successfully."
      );

      resetForm();

      await fetchMembers();
    } catch (err) {
      console.error(
        "Save team member error:",
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
  // DELETE MEMBER
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team member?"
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
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
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
            "Failed to delete team member."
        );
      }

      setSuccess(
        "Team member deleted successfully."
      );

      await fetchMembers();
    } catch (err) {
      console.error(
        "Delete team member error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete team member."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="team-management">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="team-management-header">

        <div>
          <p className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h2>Team</h2>

          <p>
            Manage the team members displayed
            on the Manifessto Studios website.
          </p>
        </div>

        <button
          type="button"
          className="add-team-member-button"
          onClick={handleAddClick}
        >
          <span>+</span>
          <span>Add Member</span>
        </button>

      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div className="team-success">
          {success}
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="team-error">
          {error}
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <div className="team-form-wrapper">

          <div className="team-form-header">

            <div>
              <p className="admin-section-eyebrow">
                {editingMember
                  ? "EDIT MEMBER"
                  : "NEW MEMBER"}
              </p>

              <h3>
                {editingMember
                  ? "Edit Team Member"
                  : "Add Team Member"}
              </h3>
            </div>

            <button
              type="button"
              className="team-close-button"
              onClick={resetForm}
              disabled={
                saving ||
                uploadingImage
              }
            >
              ×
            </button>

          </div>

          <form
            className="team-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="team-form-group">

              <label htmlFor="team-name">
                Name
              </label>

              <input
                id="team-name"
                name="name"
                type="text"
                placeholder="Shivam Jawarkar"
                value={formData.name}
                onChange={handleChange}
                maxLength={255}
                required
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>

            {/* ROLE */}

            <div className="team-form-group">

              <label htmlFor="team-role">
                Role
              </label>

              <input
                id="team-role"
                name="role"
                type="text"
                placeholder="Co-Founder & Creative Director"
                value={formData.role}
                onChange={handleChange}
                maxLength={255}
                required
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>

            {/* DESCRIPTION */}

            <div className="team-form-group team-form-full">

              <label htmlFor="team-description">
                Description
              </label>

              <textarea
                id="team-description"
                name="description"
                placeholder="Write a short description..."
                value={
                  formData.description
                }
                onChange={handleChange}
                rows="5"
                required
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>

            {/* =================================================
                PROFILE IMAGE
            ================================================= */}

            <div className="team-form-group team-form-full">

              <label>
                Profile Image
              </label>

              <div className="team-image-upload">

                <div className="team-image-upload-row">

                  <label
                    htmlFor="team-image-upload"
                    className="team-image-select-button"
                  >
                    {uploadingImage
                      ? "Uploading..."
                      : "Choose Image"}
                  </label>

                  <input
                    id="team-image-upload"
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

                {formData.imageUrl && (
                  <div className="team-image-preview">

                    <img
                      src={
                        formData.imageUrl
                      }
                      alt="Team member preview"
                    />

                    <div className="team-image-preview-info">

                      <span>
                        ✓ Image uploaded
                      </span>

                      <small>
                        Cloudinary image ready
                      </small>

                    </div>

                  </div>
                )}

                {!formData.imageUrl && (
                  <p className="team-image-help">
                    JPG, PNG or WEBP · Maximum
                    10 MB
                  </p>
                )}

              </div>

            </div>

            {/* INSTAGRAM */}

            <div className="team-form-group">

              <label htmlFor="team-instagram">
                Instagram URL
              </label>

              <input
                id="team-instagram"
                name="instagram"
                type="url"
                placeholder="https://instagram.com/..."
                value={
                  formData.instagram
                }
                onChange={handleChange}
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>

            {/* LINKEDIN */}

            <div className="team-form-group">

              <label htmlFor="team-linkedin">
                LinkedIn URL
              </label>

              <input
                id="team-linkedin"
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={
                  formData.linkedin
                }
                onChange={handleChange}
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>

            {/* DISPLAY ORDER */}

            <div className="team-form-group">

              <label htmlFor="team-order">
                Display Order
              </label>

              <input
                id="team-order"
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
                disabled={
                  saving ||
                  uploadingImage
                }
              />

            </div>

            {/* ACTIONS */}

            <div className="team-form-actions">

              <button
                type="button"
                className="team-cancel-button"
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
                className="team-save-button"
                disabled={
                  saving ||
                  uploadingImage
                }
              >
                {uploadingImage
                  ? "Uploading Image..."
                  : saving
                    ? "Saving..."
                    : editingMember
                      ? "Update Member"
                      : "Create Member"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =================================================
          TEAM LIST
      ================================================= */}

      <div className="team-list-section">

        <div className="team-list-header">

          <div>

            <p className="admin-section-eyebrow">
              ALL MEMBERS
            </p>

            <h3>
              Studio Team
            </h3>

          </div>

          <span className="team-count">
            {members.length}{" "}
            {members.length === 1
              ? "Member"
              : "Members"}
          </span>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="team-empty">

            <span>◎</span>

            <h3>
              Loading team...
            </h3>

            <p>
              Fetching team members from
              the database.
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          members.length === 0 && (
            <div className="team-empty">

              <span>◎</span>

              <h3>
                No team members yet
              </h3>

              <p>
                Add the first member to your
                studio team.
              </p>

              <button
                type="button"
                onClick={
                  handleAddClick
                }
              >
                + Add Member
              </button>

            </div>
          )}

        {/* MEMBERS */}

        {!loading &&
          members.length > 0 && (
            <div className="team-table">

              {members.map((member) => (
                <article
                  className="admin-team-card"
                  key={member.id}
                >

                  {/* IMAGE */}

                  <div className="admin-team-card-image">

                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                  {/* INFO */}

                  <div className="admin-team-card-info">

                    <h4>
                      {member.name}
                    </h4>

                    <span>
                      {member.role}
                    </span>

                  </div>

                  {/* ORDER */}

                  <div className="admin-team-order">

                    {String(
                      member.displayOrder ?? 0
                    ).padStart(2, "0")}

                  </div>

                  {/* ACTIONS */}

                  <div className="admin-team-actions">

                    <button
                      type="button"
                      className="team-edit-button"
                      onClick={() =>
                        handleEdit(member)
                      }
                      disabled={
                        deletingId ===
                        member.id
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="team-delete-button"
                      onClick={() =>
                        handleDelete(
                          member.id
                        )
                      }
                      disabled={
                        deletingId ===
                        member.id
                      }
                    >
                      {deletingId ===
                      member.id
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

export default TeamManagement;