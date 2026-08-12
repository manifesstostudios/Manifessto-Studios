package com.manifessto.backend.service;

import com.manifessto.backend.entity.Review;
import com.manifessto.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // =========================
    // GET ACTIVE REVIEWS
    // =========================

    public List<Review> getActiveReviews() {

        return reviewRepository
                .findByActiveTrueOrderByDisplayOrderAsc();
    }

    // =========================
    // ADD REVIEW
    // =========================

    public Review addReview(Review review) {

        // New reviews should be visible immediately
        review.setActive(true);

        return reviewRepository.save(review);
    }

    // =========================
    // GET REVIEW BY ID
    // =========================

    public Review getReviewById(Long id) {

        return reviewRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Review not found with id: " + id
                        )
                );
    }

    // =========================
    // UPDATE REVIEW
    // =========================

    public Review updateReview(
            Long id,
            Review updatedReview
    ) {

        Review existingReview =
                getReviewById(id);

        existingReview.setName(
                updatedReview.getName()
        );

        existingReview.setRole(
                updatedReview.getRole()
        );

        existingReview.setRating(
                updatedReview.getRating()
        );

        existingReview.setReview(
                updatedReview.getReview()
        );

        existingReview.setDisplayOrder(
                updatedReview.getDisplayOrder()
        );

        existingReview.setActive(
                updatedReview.getActive()
        );

        return reviewRepository.save(
                existingReview
        );
    }

    // =========================
    // DELETE REVIEW
    // =========================

    public void deleteReview(Long id) {

        Review existingReview =
                getReviewById(id);

        reviewRepository.delete(existingReview);
    }
}