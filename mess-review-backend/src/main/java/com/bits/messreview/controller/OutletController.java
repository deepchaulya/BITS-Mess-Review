package com.bits.messreview.controller;

import com.bits.messreview.entity.FoodItem;
import com.bits.messreview.entity.Outlet;
import com.bits.messreview.entity.OutletType;
import com.bits.messreview.repository.FoodItemRepository;
import com.bits.messreview.service.OutletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outlets")
@RequiredArgsConstructor
public class OutletController {

    private final OutletService outletService;
    private final FoodItemRepository foodItemRepository;

    @GetMapping
    public ResponseEntity<List<Outlet>> getAllOutlets() {
        return ResponseEntity.ok(outletService.getAllOutlets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Outlet> getOutletById(@PathVariable Long id) {
        return ResponseEntity.ok(outletService.getOutletById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Outlet>> getOutletsByType(@PathVariable OutletType type) {
        return ResponseEntity.ok(outletService.getOutletsByType(type));
    }

    @GetMapping("/{id}/food-items")
    public ResponseEntity<List<FoodItem>> getFoodItemsByOutlet(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemRepository.findByOutletId(id));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<Outlet>> getTopRatedOutlets() {
        return ResponseEntity.ok(outletService.getOutletsSortedByRating());
    }
}
