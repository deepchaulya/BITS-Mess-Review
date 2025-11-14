package com.bits.messreview.service;

import com.bits.messreview.dto.ComplaintRequest;
import com.bits.messreview.dto.ComplaintResponse;
import com.bits.messreview.entity.Complaint;
import com.bits.messreview.entity.Outlet;
import com.bits.messreview.entity.User;
import com.bits.messreview.repository.ComplaintRepository;
import com.bits.messreview.repository.OutletRepository;
import com.bits.messreview.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final OutletRepository outletRepository;
    private final UserRepository userRepository;

    @Transactional
    public ComplaintResponse createComplaint(Long userId, ComplaintRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Outlet outlet = outletRepository.findById(request.getOutletId())
                .orElseThrow(() -> new RuntimeException("Outlet not found"));

        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setOutlet(outlet);
        complaint.setComplaintText(request.getComplaintText());
        complaint.setIsAnonymous(request.getIsAnonymous());
        complaint.setIsResolved(false);

        Complaint savedComplaint = complaintRepository.save(complaint);
        return mapToResponse(savedComplaint);
    }

    public List<ComplaintResponse> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
        return complaints.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getComplaintsByOutlet(Long outletId) {
        List<Complaint> complaints = complaintRepository.findByOutletIdOrderByCreatedAtDesc(outletId);
        return complaints.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse resolveComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setIsResolved(true);
        Complaint savedComplaint = complaintRepository.save(complaint);
        return mapToResponse(savedComplaint);
    }

    @Transactional
    public void deleteComplaint(Long complaintId) {
        if (!complaintRepository.existsById(complaintId)) {
            throw new RuntimeException("Complaint not found");
        }
        complaintRepository.deleteById(complaintId);
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        ComplaintResponse response = new ComplaintResponse();
        response.setId(complaint.getId());
        response.setOutletId(complaint.getOutlet().getId());
        response.setOutletName(complaint.getOutlet().getName());
        response.setComplaintText(complaint.getComplaintText());
        response.setUserName(complaint.getIsAnonymous() ? "Anonymous" : complaint.getUser().getName());
        response.setIsAnonymous(complaint.getIsAnonymous());
        response.setIsResolved(complaint.getIsResolved());
        response.setCreatedAt(complaint.getCreatedAt());
        response.setUpdatedAt(complaint.getUpdatedAt());
        return response;
    }
}
