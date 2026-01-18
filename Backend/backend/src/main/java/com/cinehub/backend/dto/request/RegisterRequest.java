package com.cinehub.backend.dto.request;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String fullName;
    private LocalDate dob;
    private boolean termsAccepted;

    

}



