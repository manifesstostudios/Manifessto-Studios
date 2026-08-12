package com.manifessto.backend.controller;

import com.manifessto.backend.entity.ProjectCategory;
import com.manifessto.backend.service.ProjectCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-categories")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectCategoryController {

    private final ProjectCategoryService projectCategoryService;

    public ProjectCategoryController(
            ProjectCategoryService projectCategoryService
    ) {
        this.projectCategoryService = projectCategoryService;
    }

    // =========================
    // GET ACTIVE CATEGORIES
    // =========================

    @GetMapping
    public ResponseEntity<List<ProjectCategory>> getActiveCategories() {

        return ResponseEntity.ok(
                projectCategoryService.getActiveCategories()
        );
    }

    // =========================
    // ADD CATEGORY
    // =========================

    @PostMapping
    public ResponseEntity<ProjectCategory> addCategory(
            @RequestBody ProjectCategory projectCategory
    ) {

        return ResponseEntity.ok(
                projectCategoryService.addCategory(
                        projectCategory
                )
        );
    }

    // =========================
    // GET CATEGORY BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<ProjectCategory> getCategoryById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                projectCategoryService.getCategoryById(id)
        );
    }

    // =========================
    // UPDATE CATEGORY
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<ProjectCategory> updateCategory(
            @PathVariable Long id,
            @RequestBody ProjectCategory projectCategory
    ) {

        return ResponseEntity.ok(
                projectCategoryService.updateCategory(
                        id,
                        projectCategory
                )
        );
    }

    // =========================
    // DELETE CATEGORY
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id
    ) {

        projectCategoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}