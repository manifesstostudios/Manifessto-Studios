package com.manifessto.backend.controller;

import com.manifessto.backend.entity.Review;
import com.manifessto.backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://manifestostudios.in",
                "https://www.manifestostudios.in"
        }
)
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // =========================
    // GET ACTIVE REVIEWS
    // =========================

    @GetMapping
    public ResponseEntity<List<Review>> getActiveReviews() {

        return ResponseEntity.ok(
                reviewService.getActiveReviews()
        );
    }

    // =========================
    // ADD REVIEW
    // =========================

    @PostMapping
    public ResponseEntity<Review> addReview(
            @RequestBody Review review
    ) {

        return ResponseEntity.ok(
                reviewService.addReview(review)
        );
    }

    // =========================
    // GET REVIEW BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                reviewService.getReviewById(id)
        );
    }

    // =========================
    // UPDATE REVIEW
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long id,
            @RequestBody Review review
    ) {

        return ResponseEntity.ok(
                reviewService.updateReview(
                        id,
                        review
                )
        );
    }

    // =========================
    // DELETE REVIEW
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id
    ) {

        reviewService.deleteReview(id);

        return ResponseEntity.noContent().build();
    }
}