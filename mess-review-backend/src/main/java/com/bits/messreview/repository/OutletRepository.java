package com.bits.messreview.repository;

import com.bits.messreview.entity.Outlet;
import com.bits.messreview.entity.OutletType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutletRepository extends JpaRepository<Outlet, Long> {

    List<Outlet> findByType(OutletType type);

    List<Outlet> findAllByOrderByAverageRatingDesc();
}
