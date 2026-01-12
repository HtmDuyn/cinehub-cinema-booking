package com.cinehub.backend.controller;

import com.cinehub.backend.dto.request.LoginRequest; // <-- Nhớ import cái này
import com.cinehub.backend.dto.request.RegisterRequest;
import com.cinehub.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    // 1. ĐĂNG KÝ (http://localhost:8080/api/auth/register)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authenticationService.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. ĐĂNG NHẬP (http://localhost:8080/api/auth/login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }
}