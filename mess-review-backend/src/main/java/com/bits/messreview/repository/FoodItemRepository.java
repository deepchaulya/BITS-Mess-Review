package com.bits.messreview.repository;

import com.bits.messreview.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    List<FoodItem> findByOutletId(Long outletId);

    List<FoodItem> findByOutletIdOrderByAverageRatingDesc(Long outletId);
}
