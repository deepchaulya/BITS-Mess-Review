package com.bits.messreview.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintResponse {
    private Long id;
    private Long outletId;
    private String outletName;
    private String complaintText;
    private String userName;
    private Boolean isAnonymous;
    private Boolean isResolved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
