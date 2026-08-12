package com.manifessto.backend.repository;

import com.manifessto.backend.entity.StudioService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudioServiceRepository
        extends JpaRepository<StudioService, Long> {

    List<StudioService> findAllByOrderByDisplayOrderAsc();
}