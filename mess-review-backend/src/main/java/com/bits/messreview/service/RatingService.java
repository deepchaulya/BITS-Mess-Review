package com.bits.messreview.service;

import com.bits.messreview.dto.RatingRequest;
import com.bits.messreview.dto.RatingResponse;
import com.bits.messreview.entity.*;
import com.bits.messreview.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final OutletRepository outletRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingResponse rateOutlet(Long userId, RatingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Outlet outlet = outletRepository.findById(request.getOutletId())
                .orElseThrow(() -> new RuntimeException("Outlet not found"));

        // Always create a new rating
        Rating rating = new Rating();
        rating.setUser(user);
        rating.setOutlet(outlet);
        rating.setStars(request.getStars());
        rating.setReviewText(request.getReviewText());
        rating.setIsAnonymous(request.getIsAnonymous());

        Rating savedRating = ratingRepository.save(rating);

        // Update outlet average rating
        updateOutletAverageRating(outlet.getId());

        return mapToResponse(savedRating);
    }

    @Transactional
    public RatingResponse rateFoodItem(Long userId, RatingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new RuntimeException("Food item not found"));

        // Always create a new rating
        Rating rating = new Rating();
        rating.setUser(user);
        rating.setFoodItem(foodItem);
        rating.setStars(request.getStars());
        rating.setReviewText(request.getReviewText());
        rating.setIsAnonymous(request.getIsAnonymous());

        Rating savedRating = ratingRepository.save(rating);

        // Update food item average rating
        updateFoodItemAverageRating(foodItem.getId());

        return mapToResponse(savedRating);
    }

    public List<RatingResponse> getOutletRatings(Long outletId) {
        List<Rating> ratings = ratingRepository.findByOutletId(outletId);
        return ratings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RatingResponse> getFoodItemRatings(Long foodItemId) {
        List<Rating> ratings = ratingRepository.findByFoodItemId(foodItemId);
        return ratings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RatingResponse> getOutletReviews(Long outletId) {
        List<Rating> ratings = ratingRepository.findByOutletIdAndReviewTextIsNotNullAndIsAnonymousFalse(outletId);
        return ratings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RatingResponse> getFoodItemReviews(Long foodItemId) {
        List<Rating> ratings = ratingRepository.findByFoodItemIdAndReviewTextIsNotNullAndIsAnonymousFalse(foodItemId);
        return ratings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RatingResponse> getAllReviewsForOutlet(Long outletId) {
        // Get all food items for this outlet
        List<FoodItem> foodItems = foodItemRepository.findByOutletId(outletId);

        // Get outlet reviews (only non-anonymous with review text)
        List<Rating> outletReviews = ratingRepository.findByOutletIdAndReviewTextIsNotNullAndIsAnonymousFalse(outletId);

        // Get all food item reviews (only non-anonymous with review text)
        List<Rating> foodItemReviews = foodItems.stream()
                .flatMap(foodItem -> ratingRepository.findByFoodItemIdAndReviewTextIsNotNullAndIsAnonymousFalse(foodItem.getId()).stream())
                .collect(Collectors.toList());

        // Combine and map to responses
        outletReviews.addAll(foodItemReviews);
        return outletReviews.stream()
                .map(this::mapToResponse)
                .sorted((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt())) // Sort by newest first
                .collect(Collectors.toList());
    }

    private void updateOutletAverageRating(Long outletId) {
        List<Rating> ratings = ratingRepository.findByOutletId(outletId);
        if (!ratings.isEmpty()) {
            double average = ratings.stream()
                    .mapToInt(Rating::getStars)
                    .average()
                    .orElse(0.0);

            Outlet outlet = outletRepository.findById(outletId).orElseThrow();
            outlet.setAverageRating(Math.round(average * 10.0) / 10.0);
            outlet.setTotalRatings(ratings.size());
            outletRepository.save(outlet);
        }
    }

    private void updateFoodItemAverageRating(Long foodItemId) {
        List<Rating> ratings = ratingRepository.findByFoodItemId(foodItemId);
        if (!ratings.isEmpty()) {
            double average = ratings.stream()
                    .mapToInt(Rating::getStars)
                    .average()
                    .orElse(0.0);

            FoodItem foodItem = foodItemRepository.findById(foodItemId).orElseThrow();
            foodItem.setAverageRating(Math.round(average * 10.0) / 10.0);
            foodItem.setTotalRatings(ratings.size());
            foodItemRepository.save(foodItem);
        }
    }

    @Transactional
    public void deleteRating(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        // Store references before deletion
        Long outletId = rating.getOutlet() != null ? rating.getOutlet().getId() : null;
        Long foodItemId = rating.getFoodItem() != null ? rating.getFoodItem().getId() : null;

        // Delete the rating
        ratingRepository.delete(rating);

        // Update average ratings
        if (outletId != null) {
            updateOutletAverageRating(outletId);
        }
        if (foodItemId != null) {
            updateFoodItemAverageRating(foodItemId);
        }
    }

    private RatingResponse mapToResponse(Rating rating) {
        RatingResponse response = new RatingResponse();
        response.setId(rating.getId());
        response.setStars(rating.getStars());
        response.setReviewText(rating.getReviewText());
        response.setIsAnonymous(rating.getIsAnonymous());
        response.setUserName(rating.getIsAnonymous() ? "Anonymous" : rating.getUser().getName());
        response.setFoodItemName(rating.getFoodItem() != null ? rating.getFoodItem().getName() : null);
        response.setCreatedAt(rating.getCreatedAt());
        response.setUpdatedAt(rating.getUpdatedAt());
        return response;
    }
}
