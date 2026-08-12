import { useEffect, useState } from "react";
import "./ProjectManagement.css";

const PROJECT_API = "http://localhost:8080/api/projects";
const CATEGORY_API = "http://localhost:8080/api/project-categories";

const EMPTY_PROJECT = {
  title: "",
  categoryId: "",
  imageUrl: "",
  featured: false,
  displayOrder: "",
  active: true,
};

const EMPTY_CATEGORY = {
  name: "",
  displayOrder: "",
  active: true,
};

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [projectForm, setProjectForm] = useState({
    ...EMPTY_PROJECT,
  });

  const [categoryForm, setCategoryForm] = useState({
    ...EMPTY_CATEGORY,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deletingProjectId, setDeletingProjectId] =
    useState(null);

  const [deletingCategoryId, setDeletingCategoryId] =
    useState(null);

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  const fetchProjects = async () => {
    try {
      const response = await fetch(PROJECT_API);

      if (!response.ok) {
        throw new Error(
          `Failed to load projects (${response.status})`
        );
      }

      const data = await response.json();

      const sortedProjects = Array.isArray(data)
        ? [...data].sort(
            (a, b) =>
              (a.displayOrder ?? 0) -
              (b.displayOrder ?? 0)
          )
        : [];

      setProjects(sortedProjects);
    } catch (err) {
      console.error("Fetch projects error:", err);
      setError(err.message || "Unable to load projects.");
    }
  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API);

      if (!response.ok) {
        throw new Error(
          `Failed to load categories (${response.status})`
        );
      }

      const data = await response.json();

      const sortedCategories = Array.isArray(data)
        ? [...data].sort(
            (a, b) =>
              (a.displayOrder ?? 0) -
              (b.displayOrder ?? 0)
          )
        : [];

      setCategories(sortedCategories);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError(
        err.message || "Unable to load categories."
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchProjects(),
        fetchCategories(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =====================================================
  // PROJECT FORM CHANGE
  // =====================================================

  const handleProjectChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setProjectForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // CATEGORY FORM CHANGE
  // =====================================================

  const handleCategoryChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setCategoryForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // OPEN ADD PROJECT
  // =====================================================

  const openAddProject = () => {
    setEditingProject(null);

    setProjectForm({
      ...EMPTY_PROJECT,
      displayOrder: projects.length + 1,
    });

    setProjectFormOpen(true);
    setCategoryFormOpen(false);

    setError("");
    setSuccess("");
  };

  // =====================================================
  // OPEN EDIT PROJECT
  // =====================================================

  const openEditProject = (project) => {
    setEditingProject(project);

    setProjectForm({
      title: project.title || "",
      categoryId: project.category?.id
        ? String(project.category.id)
        : "",
      imageUrl: project.imageUrl || "",
      featured: Boolean(project.featured),
      displayOrder: project.displayOrder ?? "",
      active:
        project.active === undefined ||
        project.active === null
          ? true
          : Boolean(project.active),
    });

    setProjectFormOpen(true);
    setCategoryFormOpen(false);

    setError("");
    setSuccess("");
  };

  // =====================================================
  // CLOSE PROJECT FORM
  // =====================================================

  const closeProjectForm = () => {
    setProjectFormOpen(false);
    setEditingProject(null);
    setProjectForm({
      ...EMPTY_PROJECT,
    });
  };

  // =====================================================
  // SAVE PROJECT
  // =====================================================

  const handleProjectSubmit = async (event) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      setError(
        "Admin session expired. Please login again."
      );
      return;
    }

    const title = projectForm.title.trim();
    const imageUrl = projectForm.imageUrl.trim();
    const categoryId = Number(
      projectForm.categoryId
    );
    const displayOrder = Number(
      projectForm.displayOrder
    );

    if (!title) {
      setError("Project title is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!imageUrl) {
      setError("Image URL is required.");
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
      title,
      imageUrl,
      featured: Boolean(projectForm.featured),
      displayOrder,
      active: Boolean(projectForm.active),
    };

    const isEditing = Boolean(editingProject);

    const url = isEditing
      ? `${PROJECT_API}/${editingProject.id}?categoryId=${categoryId}`
      : `${PROJECT_API}?categoryId=${categoryId}`;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "You are not authorized. Please login again."
        );
      }

      if (!response.ok) {
        const text = await response.text();

        throw new Error(
          text ||
            `Failed to ${
              isEditing ? "update" : "create"
            } project.`
        );
      }

      setSuccess(
        isEditing
          ? "Project updated successfully."
          : "Project created successfully."
      );

      closeProjectForm();

      await fetchProjects();
    } catch (err) {
      console.error("Save project error:", err);

      setError(
        err.message || "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Admin session expired. Please login again."
      );
      return;
    }

    try {
      setDeletingProjectId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${PROJECT_API}/${id}`,
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
        const text = await response.text();

        throw new Error(
          text || "Failed to delete project."
        );
      }

      setSuccess(
        "Project deleted successfully."
      );

      await fetchProjects();
    } catch (err) {
      console.error("Delete project error:", err);

      setError(
        err.message || "Unable to delete project."
      );
    } finally {
      setDeletingProjectId(null);
    }
  };

  // =====================================================
  // OPEN ADD CATEGORY
  // =====================================================

  const openAddCategory = () => {
    setEditingCategory(null);

    setCategoryForm({
      ...EMPTY_CATEGORY,
      displayOrder: categories.length + 1,
    });

    setCategoryFormOpen(true);
    setProjectFormOpen(false);

    setError("");
    setSuccess("");
  };

  // =====================================================
  // OPEN EDIT CATEGORY
  // =====================================================

  const openEditCategory = (category) => {
    setEditingCategory(category);

    setCategoryForm({
      name: category.name || "",
      displayOrder: category.displayOrder ?? "",
      active:
        category.active === undefined ||
        category.active === null
          ? true
          : Boolean(category.active),
    });

    setCategoryFormOpen(true);
    setProjectFormOpen(false);

    setError("");
    setSuccess("");
  };

  // =====================================================
  // CLOSE CATEGORY FORM
  // =====================================================

  const closeCategoryForm = () => {
    setCategoryFormOpen(false);
    setEditingCategory(null);

    setCategoryForm({
      ...EMPTY_CATEGORY,
    });
  };

  // =====================================================
  // SAVE CATEGORY
  // =====================================================

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      setError(
        "Admin session expired. Please login again."
      );
      return;
    }

    const name = categoryForm.name.trim();

    const displayOrder = Number(
      categoryForm.displayOrder
    );

    if (!name) {
      setError("Category name is required.");
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
      displayOrder,
      active: Boolean(categoryForm.active),
    };

    const isEditing =
      Boolean(editingCategory);

    const url = isEditing
      ? `${CATEGORY_API}/${editingCategory.id}`
      : CATEGORY_API;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
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
        const text = await response.text();

        throw new Error(
          text || "Failed to save category."
        );
      }

      setSuccess(
        isEditing
          ? "Category updated successfully."
          : "Category created successfully."
      );

      closeCategoryForm();

      await fetchCategories();
    } catch (err) {
      console.error(
        "Save category error:",
        err
      );

      setError(
        err.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const deleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Admin session expired. Please login again."
      );
      return;
    }

    try {
      setDeletingCategoryId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${CATEGORY_API}/${id}`,
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
        const text = await response.text();

        throw new Error(
          text || "Failed to delete category."
        );
      }

      setSuccess(
        "Category deleted successfully."
      );

      await fetchCategories();
      await fetchProjects();
    } catch (err) {
      console.error(
        "Delete category error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete category."
      );
    } finally {
      setDeletingCategoryId(null);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="project-management">

      {/* HEADER */}

      <div className="project-management-header">

        <div>
          <p className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h2>Projects</h2>

          <p>
            Manage your studio projects and
            featured work.
          </p>
        </div>

        <div className="project-header-actions">

          <button
            type="button"
            className="project-category-button"
            onClick={openAddCategory}
          >
            + Category
          </button>

          <button
            type="button"
            className="add-project-button"
            onClick={openAddProject}
          >
            <span>+</span>
            <span>Add Project</span>
          </button>

        </div>
      </div>


      {/* MESSAGES */}

      {success && (
        <div className="project-success">
          {success}
        </div>
      )}

      {error && (
        <div className="project-error">
          {error}
        </div>
      )}


      {/* CATEGORY FORM */}

      {categoryFormOpen && (
        <div className="project-form-card">

          <div className="project-form-header">

            <div>
              <p className="admin-section-eyebrow">
                {editingCategory
                  ? "EDIT CATEGORY"
                  : "NEW CATEGORY"}
              </p>

              <h3>
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h3>
            </div>

            <button
              type="button"
              className="project-close-button"
              onClick={closeCategoryForm}
              disabled={saving}
            >
              ×
            </button>

          </div>


          <form
            className="project-form"
            onSubmit={handleCategorySubmit}
          >

            <div className="project-form-group">

              <label>
                Category Name
              </label>

              <input
                type="text"
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryChange}
                placeholder="Brand Films"
                disabled={saving}
                required
              />

            </div>


            <div className="project-form-group">

              <label>
                Display Order
              </label>

              <input
                type="number"
                name="displayOrder"
                value={
                  categoryForm.displayOrder
                }
                onChange={handleCategoryChange}
                min="1"
                step="1"
                disabled={saving}
                required
              />

            </div>


            <div className="project-options">

              <label className="project-checkbox">

                <input
                  type="checkbox"
                  name="active"
                  checked={categoryForm.active}
                  onChange={handleCategoryChange}
                  disabled={saving}
                />

                <span>Active</span>

              </label>

            </div>


            <div className="project-form-actions">

              <button
                type="button"
                className="project-cancel-button"
                onClick={closeCategoryForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="project-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingCategory
                  ? "Update Category"
                  : "Create Category"}
              </button>

            </div>

          </form>
        </div>
      )}


      {/* PROJECT FORM */}

      {projectFormOpen && (
        <div className="project-form-card">

          <div className="project-form-header">

            <div>
              <p className="admin-section-eyebrow">
                {editingProject
                  ? "EDIT PROJECT"
                  : "NEW PROJECT"}
              </p>

              <h3>
                {editingProject
                  ? "Edit Project"
                  : "Add Project"}
              </h3>
            </div>

            <button
              type="button"
              className="project-close-button"
              onClick={closeProjectForm}
              disabled={saving}
            >
              ×
            </button>

          </div>


          <form
            className="project-form"
            onSubmit={handleProjectSubmit}
          >

            <div className="project-form-group">

              <label>
                Project Title
              </label>

              <input
                type="text"
                name="title"
                value={projectForm.title}
                onChange={handleProjectChange}
                placeholder="LG Brand Campaign"
                disabled={saving}
                required
              />

            </div>


            <div className="project-form-group">

              <label>
                Category
              </label>

              <select
                name="categoryId"
                value={projectForm.categoryId}
                onChange={handleProjectChange}
                disabled={saving}
                required
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}

              </select>

            </div>


            <div className="project-form-group project-form-full">

              <label>
                Image URL
              </label>

              <input
                type="url"
                name="imageUrl"
                value={projectForm.imageUrl}
                onChange={handleProjectChange}
                placeholder="https://..."
                disabled={saving}
                required
              />

            </div>


            <div className="project-form-group">

              <label>
                Display Order
              </label>

              <input
                type="number"
                name="displayOrder"
                value={
                  projectForm.displayOrder
                }
                onChange={handleProjectChange}
                min="1"
                step="1"
                disabled={saving}
                required
              />

            </div>


            <div className="project-options">

              <label className="project-checkbox">

                <input
                  type="checkbox"
                  name="featured"
                  checked={projectForm.featured}
                  onChange={handleProjectChange}
                  disabled={saving}
                />

                <span>Featured</span>

              </label>


              <label className="project-checkbox">

                <input
                  type="checkbox"
                  name="active"
                  checked={projectForm.active}
                  onChange={handleProjectChange}
                  disabled={saving}
                />

                <span>Active</span>

              </label>

            </div>


            <div className="project-form-actions">

              <button
                type="button"
                className="project-cancel-button"
                onClick={closeProjectForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="project-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingProject
                  ? "Update Project"
                  : "Create Project"}
              </button>

            </div>

          </form>
        </div>
      )}


      {/* CATEGORIES */}

      <div className="project-section-card">

        <div className="project-section-heading">

          <div>
            <p className="admin-section-eyebrow">
              CATEGORIES
            </p>

            <h3>
              Project Categories
            </h3>
          </div>

          <span className="project-count">
            {categories.length}{" "}
            {categories.length === 1
              ? "Category"
              : "Categories"}
          </span>

        </div>


        {categories.length === 0 ? (

          <div className="project-empty-small">
            <p>
              No project categories yet.
            </p>
          </div>

        ) : (

          <div className="category-list">

            {categories.map((category) => (

              <div
                className="category-row"
                key={category.id}
              >

                <div className="category-order">
                  {String(
                    category.displayOrder ?? 0
                  ).padStart(2, "0")}
                </div>


                <div className="category-info">

                  <strong>
                    {category.name}
                  </strong>

                  <span
                    className={
                      category.active
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {category.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>


                <div className="category-actions">

                  <button
                    type="button"
                    onClick={() =>
                      openEditCategory(category)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      deleteCategory(category.id)
                    }
                    disabled={
                      deletingCategoryId ===
                      category.id
                    }
                  >
                    {deletingCategoryId ===
                    category.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>


      {/* PROJECTS */}

      <div className="project-section-card">

        <div className="project-section-heading">

          <div>
            <p className="admin-section-eyebrow">
              ALL PROJECTS
            </p>

            <h3>
              Studio Projects
            </h3>
          </div>

          <span className="project-count">
            {projects.length}{" "}
            {projects.length === 1
              ? "Project"
              : "Projects"}
          </span>

        </div>


        {loading ? (

          <div className="project-empty">

            <span>◎</span>

            <h3>
              Loading projects...
            </h3>

            <p>
              Fetching projects from database.
            </p>

          </div>

        ) : projects.length === 0 ? (

          <div className="project-empty">

            <span>◎</span>

            <h3>
              No projects yet
            </h3>

            <p>
              Add your first project to
              featured work.
            </p>

            <button
              type="button"
              onClick={openAddProject}
            >
              + Add Project
            </button>

          </div>

        ) : (

          <div className="project-list">

            {projects.map((project) => (

              <article
                className="admin-project-card"
                key={project.id}
              >

                <div className="admin-project-image">

                  <img
                    src={project.imageUrl}
                    alt={project.title}
                  />

                </div>


                <div className="admin-project-info">

                  <h4>
                    {project.title}
                  </h4>

                  <span>
                    {project.category?.name ||
                      "No Category"}
                  </span>

                </div>


                <div className="admin-project-status">

                  {project.featured && (
                    <span className="project-badge featured">
                      Featured
                    </span>
                  )}

                  <span
                    className={
                      project.active
                        ? "project-badge active"
                        : "project-badge inactive"
                    }
                  >
                    {project.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>


                <div className="admin-project-order">
                  {String(
                    project.displayOrder ?? 0
                  ).padStart(2, "0")}
                </div>


                <div className="admin-project-actions">

                  <button
                    type="button"
                    onClick={() =>
                      openEditProject(project)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      deleteProject(project.id)
                    }
                    disabled={
                      deletingProjectId ===
                      project.id
                    }
                  >
                    {deletingProjectId ===
                    project.id
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

export default ProjectManagement;