package com.manifessto.backend.repository;

import com.manifessto.backend.entity.AboutStat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AboutStatRepository
        extends JpaRepository<AboutStat, Long> {

    // Get all stats in display order
    List<AboutStat> findAllByOrderByDisplayOrderAsc();

    // Find a specific stat using its unique key
    Optional<AboutStat> findByStatKey(String statKey);
}