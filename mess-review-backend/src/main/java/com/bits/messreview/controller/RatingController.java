package com.bits.messreview.controller;

import com.bits.messreview.dto.RatingRequest;
import com.bits.messreview.dto.RatingResponse;
import com.bits.messreview.entity.Role;
import com.bits.messreview.security.CustomUserDetails;
import com.bits.messreview.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/outlet")
    public ResponseEntity<RatingResponse> rateOutlet(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody RatingRequest request) {
        RatingResponse response = ratingService.rateOutlet(userDetails.getUser().getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/food-item")
    public ResponseEntity<RatingResponse> rateFoodItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody RatingRequest request) {
        RatingResponse response = ratingService.rateFoodItem(userDetails.getUser().getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/outlet/{outletId}")
    public ResponseEntity<List<RatingResponse>> getOutletRatings(@PathVariable Long outletId) {
        return ResponseEntity.ok(ratingService.getOutletRatings(outletId));
    }

    @GetMapping("/food-item/{foodItemId}")
    public ResponseEntity<List<RatingResponse>> getFoodItemRatings(@PathVariable Long foodItemId) {
        return ResponseEntity.ok(ratingService.getFoodItemRatings(foodItemId));
    }

    @GetMapping("/outlet/{outletId}/reviews")
    public ResponseEntity<List<RatingResponse>> getOutletReviews(@PathVariable Long outletId) {
        return ResponseEntity.ok(ratingService.getOutletReviews(outletId));
    }

    @GetMapping("/food-item/{foodItemId}/reviews")
    public ResponseEntity<List<RatingResponse>> getFoodItemReviews(@PathVariable Long foodItemId) {
        return ResponseEntity.ok(ratingService.getFoodItemReviews(foodItemId));
    }

    @GetMapping("/outlet/{outletId}/all-reviews")
    public ResponseEntity<List<RatingResponse>> getAllReviewsForOutlet(@PathVariable Long outletId) {
        return ResponseEntity.ok(ratingService.getAllReviewsForOutlet(outletId));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long ratingId) {
        // Only admins can delete ratings
        if (userDetails.getUser().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }
}
