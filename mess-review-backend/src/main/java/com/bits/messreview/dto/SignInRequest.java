package com.bits.messreview.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Pattern(
        regexp = "^[a-zA-Z0-9._-]+@pilani\\.bits-pilani\\.ac\\.in$",
        message = "Only BITS Pilani email addresses are allowed (@pilani.bits-pilani.ac.in)"
    )
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
