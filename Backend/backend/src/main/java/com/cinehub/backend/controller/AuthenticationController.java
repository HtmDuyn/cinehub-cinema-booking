package com.cinehub.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinehub.backend.dto.request.LoginRequest;
import com.cinehub.backend.dto.request.RegisterRequest;
import com.cinehub.backend.exception.RegistrationException;
import com.cinehub.backend.exception.VerificationException;
import com.cinehub.backend.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    // 1️ ĐĂNG KÝ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String message = authenticationService.register(request);
            return ResponseEntity.ok(message); // luôn trả về 200 nếu lưu thành công
        } catch (RegistrationException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // ❌ input sai
        }
    }

    // 2️ XÁC THỰC EMAIL
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String email, @RequestParam String code) {
        try {
            authenticationService.verifyUser(email, code);
            return ResponseEntity.ok("Kích hoạt tài khoản thành công! Bạn có thể đăng nhập ngay.");
        } catch (VerificationException e) {
            // ⚠️ Nếu OTP hết hạn → 403
            if (e.getMessage().toLowerCase().contains("hết hạn")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage()); // mã sai
        }
    }

    // 3️ ĐĂNG NHẬP
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authenticationService.login(request)); // trả về token nếu thành công
        } catch (VerificationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); // chưa xác thực
        } catch (RegistrationException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // sai thông tin
        }
    }
}
