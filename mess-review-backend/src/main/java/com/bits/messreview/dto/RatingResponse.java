package com.bits.messreview.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {

    private Long id;
    private Integer stars;
    private String reviewText;
    private Boolean isAnonymous;
    private String userName;
    private String foodItemName;  // Name of food item if this is a food item rating
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
