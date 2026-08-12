package com.manifessto.backend.service;

import com.manifessto.backend.entity.Project;
import com.manifessto.backend.entity.ProjectCategory;
import com.manifessto.backend.repository.ProjectCategoryRepository;
import com.manifessto.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectCategoryRepository projectCategoryRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            ProjectCategoryRepository projectCategoryRepository
    ) {
        this.projectRepository = projectRepository;
        this.projectCategoryRepository = projectCategoryRepository;
    }

    // =========================
    // GET ALL ACTIVE PROJECTS
    // =========================

    public List<Project> getActiveProjects() {

        return projectRepository
                .findByActiveTrueOrderByDisplayOrderAsc();
    }

    // =========================
    // GET FEATURED PROJECTS
    // =========================

    public List<Project> getFeaturedProjects() {

        return projectRepository
                .findByActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc();
    }

    // =========================
    // GET PROJECTS BY CATEGORY
    // =========================

    public List<Project> getProjectsByCategory(Long categoryId) {

        return projectRepository
                .findByCategoryIdAndActiveTrueOrderByDisplayOrderAsc(
                        categoryId
                );
    }

    // =========================
    // GET FEATURED PROJECTS BY CATEGORY
    // =========================

    public List<Project> getFeaturedProjectsByCategory(Long categoryId) {

        return projectRepository
                .findByCategoryIdAndActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc(
                        categoryId
                );
    }

    // =========================
    // ADD PROJECT
    // =========================

    public Project addProject(
            Project project,
            Long categoryId
    ) {

        ProjectCategory category =
                projectCategoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project category not found with id: "
                                                + categoryId
                                )
                        );

        project.setCategory(category);

        return projectRepository.save(project);
    }

    // =========================
    // GET PROJECT BY ID
    // =========================

    public Project getProjectById(Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Project not found with id: " + id
                        )
                );
    }

    // =========================
    // UPDATE PROJECT
    // =========================

    public Project updateProject(
            Long id,
            Project updatedProject,
            Long categoryId
    ) {

        Project existingProject =
                getProjectById(id);

        ProjectCategory category =
                projectCategoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project category not found with id: "
                                                + categoryId
                                )
                        );

        existingProject.setTitle(
                updatedProject.getTitle()
        );

        existingProject.setCategory(category);

        existingProject.setImageUrl(
                updatedProject.getImageUrl()
        );

        existingProject.setFeatured(
                updatedProject.getFeatured()
        );

        existingProject.setDisplayOrder(
                updatedProject.getDisplayOrder()
        );

        existingProject.setActive(
                updatedProject.getActive()
        );

        return projectRepository.save(
                existingProject
        );
    }

    // =========================
    // DELETE PROJECT
    // =========================

    public void deleteProject(Long id) {

        Project existingProject =
                getProjectById(id);

        projectRepository.delete(existingProject);
    }
}