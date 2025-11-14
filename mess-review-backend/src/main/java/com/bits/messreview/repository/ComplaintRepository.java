package com.bits.messreview.repository;

import com.bits.messreview.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByOutletId(Long outletId);
    List<Complaint> findByOutletIdOrderByCreatedAtDesc(Long outletId);
    List<Complaint> findAllByOrderByCreatedAtDesc();
}
