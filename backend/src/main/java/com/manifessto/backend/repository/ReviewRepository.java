package com.manifessto.backend.repository;

import com.manifessto.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // All active reviews
    List<Review> findByActiveTrueOrderByDisplayOrderAsc();

}