package com.cinehub.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinehub.backend.dto.request.LoginRequest;
import com.cinehub.backend.dto.request.RegisterRequest;
import com.cinehub.backend.dto.response.AuthenticationResponse;
import com.cinehub.backend.exception.RegistrationException;
import com.cinehub.backend.exception.VerificationException;
import com.cinehub.backend.model.entity.RefreshToken;
import com.cinehub.backend.service.AuthenticationService;
import com.cinehub.backend.service.JwtService;
import com.cinehub.backend.service.LogoutService;
import com.cinehub.backend.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final LogoutService logoutService;

    // 1️ ĐĂNG KÝ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthenticationResponse response = authenticationService.register(request);
            return ResponseEntity.ok(response);
        } catch (RegistrationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2️ XÁC THỰC EMAIL
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String email, @RequestParam String code) {
        try {
            AuthenticationResponse response = authenticationService.verifyUser(email, code);
            return ResponseEntity.ok(response);
        } catch (VerificationException e) {
            if (e.getMessage().toLowerCase().contains("hết hạn")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3️ ĐĂNG NHẬP
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthenticationResponse response = authenticationService.login(request);
            return ResponseEntity.ok(response);
        } catch (VerificationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RegistrationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4️ GỬI LẠI MÃ XÁC THỰC
    @PostMapping("/resend-code")
    public ResponseEntity<AuthenticationResponse> resendCode(@RequestParam String email) {
        return ResponseEntity.ok(authenticationService.resendVerificationCode(email));
    }

    // 5️ LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String refreshToken) {
        logoutService.logout(refreshToken.replace("Bearer ", ""));
        return ResponseEntity.ok("Đăng xuất thành công!");
    }

    // 6️ REFRESH TOKEN
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(@RequestParam String refreshToken) {
        RefreshToken rt = refreshTokenService.validate(refreshToken);
        var newAccessToken = jwtService.generateToken(rt.getAccount());
        return ResponseEntity.ok(AuthenticationResponse.builder()
                .token(newAccessToken)
                .refreshToken(refreshToken)
                .id(rt.getAccount().getId())
                .username(rt.getAccount().getUsername())
                .role(rt.getAccount().getRole().name())
                .email(rt.getAccount().getEmail())
                .fullName(rt.getAccount().getFullName())
                .phoneNumber(rt.getAccount().getPhoneNumber())
                .membershipScore(rt.getAccount().getMembershipScore())
                .dob(rt.getAccount().getDob())
                .build());
    }

}
