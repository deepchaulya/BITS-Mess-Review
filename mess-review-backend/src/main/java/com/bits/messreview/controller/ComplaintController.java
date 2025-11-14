package com.bits.messreview.controller;

import com.bits.messreview.dto.ComplaintRequest;
import com.bits.messreview.dto.ComplaintResponse;
import com.bits.messreview.entity.Role;
import com.bits.messreview.security.CustomUserDetails;
import com.bits.messreview.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ComplaintRequest request) {
        ComplaintResponse response = complaintService.createComplaint(userDetails.getUser().getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Only admins can view all complaints
        if (userDetails.getUser().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/outlet/{outletId}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByOutlet(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long outletId) {
        // Only admins can view complaints
        if (userDetails.getUser().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(complaintService.getComplaintsByOutlet(outletId));
    }

    @PutMapping("/{complaintId}/resolve")
    public ResponseEntity<ComplaintResponse> resolveComplaint(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long complaintId) {
        // Only admins can resolve complaints
        if (userDetails.getUser().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        ComplaintResponse response = complaintService.resolveComplaint(complaintId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{complaintId}")
    public ResponseEntity<Void> deleteComplaint(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long complaintId) {
        // Only admins can delete complaints
        if (userDetails.getUser().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        complaintService.deleteComplaint(complaintId);
        return ResponseEntity.noContent().build();
    }
}
