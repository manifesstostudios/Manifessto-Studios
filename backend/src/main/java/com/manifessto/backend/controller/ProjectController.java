package com.manifessto.backend.controller;

import com.manifessto.backend.entity.Project;
import com.manifessto.backend.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // =========================
    // GET ALL ACTIVE PROJECTS
    // =========================

    @GetMapping
    public ResponseEntity<List<Project>> getActiveProjects() {

        return ResponseEntity.ok(
                projectService.getActiveProjects()
        );
    }

    // =========================
    // GET FEATURED PROJECTS
    // =========================

    @GetMapping("/featured")
    public ResponseEntity<List<Project>> getFeaturedProjects() {

        return ResponseEntity.ok(
                projectService.getFeaturedProjects()
        );
    }

    // =========================
    // GET PROJECTS BY CATEGORY
    // =========================

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Project>> getProjectsByCategory(
            @PathVariable Long categoryId
    ) {

        return ResponseEntity.ok(
                projectService.getProjectsByCategory(categoryId)
        );
    }

    // =========================
    // GET FEATURED BY CATEGORY
    // =========================

    @GetMapping("/category/{categoryId}/featured")
    public ResponseEntity<List<Project>> getFeaturedProjectsByCategory(
            @PathVariable Long categoryId
    ) {

        return ResponseEntity.ok(
                projectService.getFeaturedProjectsByCategory(categoryId)
        );
    }

    // =========================
    // GET PROJECT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                projectService.getProjectById(id)
        );
    }

    // =========================
    // ADD PROJECT
    // =========================

    @PostMapping
    public ResponseEntity<Project> addProject(
            @RequestParam Long categoryId,
            @RequestBody Project project
    ) {

        return ResponseEntity.ok(
                projectService.addProject(
                        project,
                        categoryId
                )
        );
    }

    // =========================
    // UPDATE PROJECT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id,
            @RequestParam Long categoryId,
            @RequestBody Project project
    ) {

        return ResponseEntity.ok(
                projectService.updateProject(
                        id,
                        project,
                        categoryId
                )
        );
    }

    // =========================
    // DELETE PROJECT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id
    ) {

        projectService.deleteProject(id);

        return ResponseEntity.noContent().build();
    }
}