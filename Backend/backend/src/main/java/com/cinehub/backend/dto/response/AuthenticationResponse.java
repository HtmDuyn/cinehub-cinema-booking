package com.cinehub.backend.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token; // Token
    private String username;
    private String role;
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Integer membershipScore;
    private LocalDate dob;
}