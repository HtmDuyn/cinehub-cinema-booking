package com.cinehub.backend.dto.response;
import com.cinehub.backend.model.enums.Role;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class AccountResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private boolean active;
}
