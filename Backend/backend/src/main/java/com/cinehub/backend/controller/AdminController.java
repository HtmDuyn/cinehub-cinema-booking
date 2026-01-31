package com.cinehub.backend.controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinehub.backend.dto.response.AccountResponse;
import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.model.enums.Role;
import com.cinehub.backend.service.AdminService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor // tự động tạo constructor 
@PreAuthorize("hasRole('ADMIN')")

/**
 * AdminController
 * ----------------
 * Controller dành cho ADMIN quản lý tài khoản:
 *  - Tạo tài khoản nhân viên
 *  - Đổi role
 *  - Khóa / mở khóa account
 */
public class AdminController {
    private final AdminService adminService;
      @PostMapping
    public AccountResponse create(@RequestBody Account account) {
        return toResponse(adminService.createStaff(account));
    }

    @PutMapping("/{id}/role")
    public AccountResponse changeRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {
        return toResponse(adminService.changeRole(id, role));
    }

    @PutMapping("/{id}/lock")
    public AccountResponse lock(@PathVariable Long id) {
        return toResponse(adminService.lockAccount(id));
    }

    @PutMapping("/{id}/unlock")
    public AccountResponse unlock(@PathVariable Long id) {
        return toResponse(adminService.unlockAccount(id));
    }
    private AccountResponse toResponse(Account acc) {
        return AccountResponse.builder()
                .id(acc.getId())
                .username(acc.getUsername())
                .email(acc.getEmail())
                .fullName(acc.getFullName())
                .phoneNumber(acc.getPhoneNumber())
                .role(acc.getRole())
                .active(acc.isActive())
                .build();
    }

}
