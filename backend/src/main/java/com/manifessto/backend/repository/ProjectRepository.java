package com.manifessto.backend.repository;

import com.manifessto.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // All active projects
    List<Project> findByActiveTrueOrderByDisplayOrderAsc();

    // Active + featured projects for homepage
    List<Project> findByActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc();

    // Active projects of a particular category
    List<Project> findByCategoryIdAndActiveTrueOrderByDisplayOrderAsc(
            Long categoryId
    );

    // Active + featured projects of a particular category
    List<Project> findByCategoryIdAndActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc(
            Long categoryId
    );
}