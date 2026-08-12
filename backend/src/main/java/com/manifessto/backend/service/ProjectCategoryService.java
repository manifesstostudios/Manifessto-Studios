package com.manifessto.backend.service;

import com.manifessto.backend.entity.ProjectCategory;
import com.manifessto.backend.repository.ProjectCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectCategoryService {

    private final ProjectCategoryRepository projectCategoryRepository;

    public ProjectCategoryService(
            ProjectCategoryRepository projectCategoryRepository
    ) {
        this.projectCategoryRepository = projectCategoryRepository;
    }

    // =========================
    // GET ACTIVE CATEGORIES
    // =========================

    public List<ProjectCategory> getActiveCategories() {
        return projectCategoryRepository
                .findByActiveTrueOrderByDisplayOrderAsc();
    }

    // =========================
    // ADD CATEGORY
    // =========================

    public ProjectCategory addCategory(
            ProjectCategory projectCategory
    ) {
        return projectCategoryRepository.save(projectCategory);
    }

    // =========================
    // GET CATEGORY BY ID
    // =========================

    public ProjectCategory getCategoryById(Long id) {

        return projectCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Project category not found with id: " + id
                        )
                );
    }

    // =========================
    // UPDATE CATEGORY
    // =========================

    public ProjectCategory updateCategory(
            Long id,
            ProjectCategory updatedCategory
    ) {

        ProjectCategory existingCategory =
                getCategoryById(id);

        existingCategory.setName(
                updatedCategory.getName()
        );

        existingCategory.setDisplayOrder(
                updatedCategory.getDisplayOrder()
        );

        existingCategory.setActive(
                updatedCategory.getActive()
        );

        return projectCategoryRepository.save(
                existingCategory
        );
    }

    // =========================
    // DELETE CATEGORY
    // =========================

    public void deleteCategory(Long id) {

        ProjectCategory existingCategory =
                getCategoryById(id);

        projectCategoryRepository.delete(
                existingCategory
        );
    }
}