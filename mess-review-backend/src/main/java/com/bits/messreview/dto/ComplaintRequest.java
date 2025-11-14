package com.bits.messreview.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotNull(message = "Outlet ID is required")
    private Long outletId;

    @NotBlank(message = "Complaint text is required")
    private String complaintText;

    private Boolean isAnonymous = false;
}
