package com.bits.messreview.service;

import com.bits.messreview.entity.Outlet;
import com.bits.messreview.entity.OutletType;
import com.bits.messreview.repository.OutletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OutletService {

    private final OutletRepository outletRepository;

    public List<Outlet> getAllOutlets() {
        return outletRepository.findAll();
    }

    public List<Outlet> getOutletsByType(OutletType type) {
        return outletRepository.findByType(type);
    }

    public Outlet getOutletById(Long id) {
        return outletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Outlet not found with id: " + id));
    }

    public List<Outlet> getOutletsSortedByRating() {
        return outletRepository.findAllByOrderByAverageRatingDesc();
    }
}
