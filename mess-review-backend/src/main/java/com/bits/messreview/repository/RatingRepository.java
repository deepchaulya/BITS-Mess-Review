package com.bits.messreview.repository;

import com.bits.messreview.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByOutletId(Long outletId);

    List<Rating> findByFoodItemId(Long foodItemId);

    Optional<Rating> findByUserIdAndOutletId(Long userId, Long outletId);

    Optional<Rating> findByUserIdAndFoodItemId(Long userId, Long foodItemId);

    List<Rating> findByOutletIdAndReviewTextIsNotNull(Long outletId);

    List<Rating> findByFoodItemIdAndReviewTextIsNotNull(Long foodItemId);

    // Get non-anonymous reviews only (for display in recent reviews)
    List<Rating> findByOutletIdAndReviewTextIsNotNullAndIsAnonymousFalse(Long outletId);

    List<Rating> findByFoodItemIdAndReviewTextIsNotNullAndIsAnonymousFalse(Long foodItemId);
}
