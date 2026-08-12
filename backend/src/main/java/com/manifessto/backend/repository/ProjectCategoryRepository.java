package com.manifessto.backend.repository;

import com.manifessto.backend.entity.ProjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectCategoryRepository
        extends JpaRepository<ProjectCategory, Long> {

    List<ProjectCategory> findByActiveTrueOrderByDisplayOrderAsc();
}