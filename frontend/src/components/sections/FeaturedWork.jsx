import { useEffect, useState } from "react";

import api from "../../services/api";

import "./FeaturedWork.css";


const FeaturedWork = () => {

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");

  const [loading, setLoading] = useState(true);


  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {

    const fetchFeaturedWork = async () => {

      try {

        const [
          projectsResponse,
          categoriesResponse
        ] = await Promise.all([

          api.get("/projects/featured"),

          api.get("/project-categories")

        ]);


        setProjects(projectsResponse.data);

        setCategories(categoriesResponse.data);

      } catch (error) {

        console.error(
          "Failed to load featured work:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchFeaturedWork();

  }, []);


  // =========================
  // FILTER PROJECTS
  // =========================

  const filteredProjects =
    activeCategory === "All"

      ? projects

      : projects.filter(
          (project) =>
            project.category?.name === activeCategory
        );


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return null;

  }


  return (

    <section className="featured-work">

      <div className="featured-container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="featured-header">


          <div className="featured-heading">

            <p className="featured-eyebrow">
              FEATURED WORK
            </p>


            <h2>
              Selected Projects
            </h2>

          </div>


          {/* =========================
              FILTERS
          ========================= */}

          <div className="featured-filters">


            {/* ALL */}

            <button
              type="button"
              className={
                activeCategory === "All"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory("All")
              }
            >
              All
            </button>


            {/* DATABASE CATEGORIES */}

            {categories.map((category) => (

              <button
                key={category.id}
                type="button"
                className={
                  activeCategory === category.name
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveCategory(category.name)
                }
              >
                {category.name}
              </button>

            ))}


          </div>

        </div>


        {/* =========================
            PROJECT GRID
        ========================= */}

        <div className="featured-grid">


          {filteredProjects.map(
            (project, index) => (

              <article
                key={project.id}
                className={`project-card ${
                  index === 0
                    ? "project-large"
                    : ""
                }`}
              >


                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="project-image"
                />


                <div className="project-overlay"></div>


                <div className="project-info">


                  <h3>
                    {project.title}
                  </h3>


                  <p>
                    {project.category?.name}
                  </p>


                </div>


              </article>

            )
          )}


        </div>


      </div>

    </section>

  );

};


export default FeaturedWork;