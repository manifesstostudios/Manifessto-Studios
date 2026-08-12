import { useEffect, useState } from "react";

import "./TeamManagement.css";


const API_URL =
  "http://localhost:8080/api/team-members";

const UPLOAD_API_URL =
  "http://localhost:8080/api/uploads/image";


/* =========================================================
   SOCIAL PLATFORMS
========================================================= */

const SOCIAL_PLATFORMS = [
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
  },
  {
    value: "youtube",
    label: "YouTube",
  },
  {
    value: "facebook",
    label: "Facebook",
  },
  {
    value: "twitter",
    label: "X / Twitter",
  },
  {
    value: "website",
    label: "Website",
  },
  {
    value: "behance",
    label: "Behance",
  },
  {
    value: "dribbble",
    label: "Dribbble",
  },
];


/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM = {
  name: "",
  role: "",
  description: "",
  imageUrl: "",
  socialLinks: [],
  displayOrder: "",
};


/* =========================================================
   COMPONENT
========================================================= */

const TeamManagement = () => {

  const [members, setMembers] =
    useState([]);


  const [showForm, setShowForm] =
    useState(false);


  const [editingMember, setEditingMember] =
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
  // TOKEN
  // =====================================================

  const getToken = () => {

    return localStorage.getItem(
      "adminToken"
    );
  };


  // =====================================================
  // AUTH HEADERS
  // =====================================================

  const getAuthHeaders = () => {

    const token = getToken();

    return token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {};
  };


  // =====================================================
  // FETCH MEMBERS
  // =====================================================

  const fetchMembers = async () => {

    setLoading(true);

    setError("");

    try {

      const response =
        await fetch(API_URL);


      if (!response.ok) {

        throw new Error(
          `Failed to load team members (${response.status})`
        );
      }


      const data =
        await response.json();


      const sortedMembers =
        Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                (a.displayOrder ?? 0) -
                (b.displayOrder ?? 0)
            )
          : [];


      setMembers(
        sortedMembers
      );

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
  // PARSE SOCIAL LINKS
  // =====================================================

  const parseSocialLinks = (
    value,
    member = null
  ) => {

    if (value) {

      try {

        const parsed =
          JSON.parse(value);


        if (
          Array.isArray(parsed)
        ) {

          return parsed.filter(
            (item) =>
              item &&
              item.platform &&
              item.url
          );
        }

      } catch (err) {

        console.error(
          "Invalid social links:",
          err
        );
      }
    }


    /*
     * BACKWARD COMPATIBILITY
     *
     * Existing members that only have
     * Instagram / LinkedIn will continue
     * to work.
     */

    const oldLinks = [];


    if (
      member &&
      member.instagram
    ) {

      oldLinks.push({
        platform: "instagram",
        url: member.instagram,
      });
    }


    if (
      member &&
      member.linkedin
    ) {

      oldLinks.push({
        platform: "linkedin",
        url: member.linkedin,
      });
    }


    return oldLinks;
  };


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
  // IMAGE UPLOAD
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


    // -----------------------------------------------------
    // FILE TYPE
    // -----------------------------------------------------

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      setError(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }


    // -----------------------------------------------------
    // FILE SIZE
    // -----------------------------------------------------

    const maxSize =
      10 * 1024 * 1024;


    if (
      file.size > maxSize
    ) {

      setError(
        "Image size must be less than 10 MB."
      );

      event.target.value = "";

      return;
    }


    // -----------------------------------------------------
    // TOKEN
    // -----------------------------------------------------

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


      if (
        response.status === 401 ||
        response.status === 403
      ) {

        throw new Error(
          "You are not authorized to upload images. Please login again."
        );
      }


      if (!response.ok) {

        const errorText =
          await response.text();


        throw new Error(
          errorText ||
            `Image upload failed (${response.status}).`
        );
      }


      const data =
        await response.json();


      if (!data.url) {

        throw new Error(
          "Image uploaded but no image URL was returned."
        );
      }


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
        "Image upload error:",
        err
      );


      setError(
        err.message ||
          "Unable to upload image."
      );

    } finally {

      setUploadingImage(false);

      event.target.value = "";
    }
  };


  // =====================================================
  // ADD SOCIAL LINK
  // =====================================================

  const handleAddSocialLink = () => {

    setFormData(
      (previous) => ({

        ...previous,

        socialLinks: [
          ...previous.socialLinks,

          {
            platform: "instagram",
            url: "",
          },
        ],
      })
    );


    setError("");

    setSuccess("");
  };


  // =====================================================
  // CHANGE SOCIAL LINK
  // =====================================================

  const handleSocialLinkChange = (
    index,
    field,
    value
  ) => {

    setFormData(
      (previous) => {

        const updatedLinks =
          [...previous.socialLinks];


        updatedLinks[index] = {
          ...updatedLinks[index],
          [field]: value,
        };


        return {
          ...previous,
          socialLinks:
            updatedLinks,
        };
      }
    );


    setError("");

    setSuccess("");
  };


  // =====================================================
  // REMOVE SOCIAL LINK
  // =====================================================

  const handleRemoveSocialLink = (
    index
  ) => {

    setFormData(
      (previous) => ({

        ...previous,

        socialLinks:
          previous.socialLinks.filter(
            (_, socialIndex) =>
              socialIndex !== index
          ),
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
      socialLinks: [],
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

      displayOrder:
        members.length + 1,

      socialLinks: [],
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

      name:
        member.name || "",

      role:
        member.role || "",

      description:
        member.description || "",

      imageUrl:
        member.imageUrl || "",

      socialLinks:
        parseSocialLinks(
          member.socialLinks,
          member
        ),

      displayOrder:
        member.displayOrder ?? "",
    });


    setShowForm(true);

    setError("");

    setSuccess("");
  };


  // =====================================================
  // SUBMIT
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


    const name =
      formData.name.trim();


    const role =
      formData.role.trim();


    const description =
      formData.description.trim();


    const imageUrl =
      formData.imageUrl.trim();


    const displayOrder =
      Number(
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


    // =====================================================
    // CLEAN SOCIAL LINKS
    // =====================================================

    const cleanSocialLinks =
      formData.socialLinks
        .filter(
          (item) =>
            item &&
            item.platform &&
            item.url &&
            item.url.trim()
        )
        .map(
          (item) => ({
            platform:
              item.platform,

            url:
              item.url.trim(),
          })
        );


    // =====================================================
    // REMOVE DUPLICATE PLATFORMS
    // =====================================================

    const uniquePlatforms =
      new Set();


    const finalSocialLinks =
      cleanSocialLinks.filter(
        (item) => {

          if (
            uniquePlatforms.has(
              item.platform
            )
          ) {

            return false;
          }


          uniquePlatforms.add(
            item.platform
          );


          return true;
        }
      );


    // =====================================================
    // SAVE
    // =====================================================

    setSaving(true);

    setError("");

    setSuccess("");


    try {

      const payload = {

        name,

        role,

        description,

        imageUrl,

        /*
         * NEW CUSTOM SOCIAL LINKS
         */
        socialLinks:
          JSON.stringify(
            finalSocialLinks
          ),

        /*
         * Keep old fields empty for new
         * custom-link based records.
         */
        instagram: null,

        linkedin: null,

        displayOrder,
      };


      const isEditing =
        editingMember !== null;


      const url =
        isEditing
          ? `${API_URL}/${editingMember.id}`
          : API_URL;


      const method =
        isEditing
          ? "PUT"
          : "POST";


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
            `Failed to save team member (${response.status}).`
        );
      }


      await response.json();


      setSuccess(
        isEditing
          ? "Team member updated successfully."
          : "Team member added successfully."
      );


      await fetchMembers();


      setTimeout(() => {

        resetForm();

      }, 700);


    } catch (err) {

      console.error(
        "Save team member error:",
        err
      );


      setError(
        err.message ||
          "Unable to save team member."
      );

    } finally {

      setSaving(false);
    }
  };


  // =====================================================
  // DELETE MEMBER
  // =====================================================

  const handleDelete = async (
    member
  ) => {

    const confirmed =
      window.confirm(
        `Delete ${member.name}? This action cannot be undone.`
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


    setDeletingId(
      member.id
    );


    setError("");

    setSuccess("");


    try {

      const response =
        await fetch(
          `${API_URL}/${member.id}`,
          {
            method: "DELETE",

            headers:
              getAuthHeaders(),
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
            `Failed to delete team member (${response.status}).`
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


  return (

    <div className="team-management">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="team-management-header">

        <div>

          <p className="admin-section-eyebrow">
            TEAM MANAGEMENT
          </p>

          <h2>
            Studio Team
          </h2>

          <p>
            Manage the people behind
            Manifessto Studios.
          </p>

        </div>


        {!showForm && (

          <button
            type="button"
            className="add-team-member-button"
            onClick={
              handleAddClick
            }
          >
            + Add Team Member
          </button>

        )}

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
              onClick={
                resetForm
              }
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
            onSubmit={
              handleSubmit
            }
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
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
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
                value={
                  formData.role
                }
                onChange={
                  handleChange
                }
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
                onChange={
                  handleChange
                }
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


            {/* =================================================
                SOCIAL LINKS
            ================================================= */}

            <div className="team-form-group team-form-full">

              <div className="team-social-header">

                <div>

                  <label>
                    Social Links
                  </label>

                  <small>
                    Add only the social platforms
                    this member uses.
                  </small>

                </div>


                <button
                  type="button"
                  className="team-add-social-button"
                  onClick={
                    handleAddSocialLink
                  }
                  disabled={
                    saving ||
                    uploadingImage
                  }
                >
                  + Add Social Link
                </button>

              </div>


              <div className="team-social-list">

                {formData.socialLinks.length === 0 && (

                  <div className="team-social-empty">
                    No social links added.
                  </div>

                )}


                {formData.socialLinks.map(
                  (social, index) => (

                    <div
                      className="team-social-row"
                      key={index}
                    >

                      <select
                        value={
                          social.platform
                        }
                        onChange={(event) =>
                          handleSocialLinkChange(
                            index,
                            "platform",
                            event.target.value
                          )
                        }
                        disabled={
                          saving ||
                          uploadingImage
                        }
                      >

                        {SOCIAL_PLATFORMS.map(
                          (platform) => (

                            <option
                              key={
                                platform.value
                              }
                              value={
                                platform.value
                              }
                            >
                              {platform.label}
                            </option>

                          )
                        )}

                      </select>


                      <input
                        type="url"
                        placeholder="https://..."
                        value={
                          social.url
                        }
                        onChange={(event) =>
                          handleSocialLinkChange(
                            index,
                            "url",
                            event.target.value
                          )
                        }
                        disabled={
                          saving ||
                          uploadingImage
                        }
                      />


                      <button
                        type="button"
                        className="team-remove-social-button"
                        onClick={() =>
                          handleRemoveSocialLink(
                            index
                          )
                        }
                        disabled={
                          saving ||
                          uploadingImage
                        }
                        aria-label="Remove social link"
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

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


            {/* ACTIONS */}

            <div className="team-form-actions">

              <button
                type="button"
                className="team-cancel-button"
                onClick={
                  resetForm
                }
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

            <span>
              ◎
            </span>

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

              <span>
                ◎
              </span>

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

              {members.map(
                (member) => (

                  <article
                    className="admin-team-card"
                    key={
                      member.id
                    }
                  >

                    {/* IMAGE */}

                    <div className="admin-team-card-image">

                      <img
                        src={
                          member.imageUrl
                        }
                        alt={
                          member.name
                        }
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
                        member.displayOrder ??
                          0
                      ).padStart(
                        2,
                        "0"
                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="admin-team-actions">

                      <button
                        type="button"
                        className="team-edit-button"
                        onClick={() =>
                          handleEdit(
                            member
                          )
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
                            member
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

                )
              )}

            </div>

          )}

      </div>

    </div>
  );
};


export default TeamManagement;