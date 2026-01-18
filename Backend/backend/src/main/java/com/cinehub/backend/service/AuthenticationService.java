package com.cinehub.backend.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cinehub.backend.dto.request.LoginRequest;
import com.cinehub.backend.dto.request.RegisterRequest;
import com.cinehub.backend.dto.response.AuthenticationResponse;
import com.cinehub.backend.exception.RegistrationException;
import com.cinehub.backend.exception.VerificationException;
import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.model.enums.Role;
import com.cinehub.backend.repository.AccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // --- 1. ĐĂNG KÝ ---
    public String register(RegisterRequest request) {
        if (!request.isTermsAccepted()) {
            throw new RegistrationException("Vui lòng đồng ý với điều khoản sử dụng!");
        }
        if (accountRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RegistrationException("Lỗi: Username đã tồn tại!");
        }
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RegistrationException("Lỗi: Email đã tồn tại!");
        }

        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setEmail(request.getEmail());
        account.setPhoneNumber(request.getPhoneNumber());
        account.setFullName(request.getFullName());
        account.setDob(request.getDob());
        account.setRole(Role.CUSTOMER);
        account.setActive(false);
        account.setMembershipScore(0);

        String randomCode = String.valueOf(new Random().nextInt(900000) + 100000);
        account.setVerificationCode(randomCode);
        account.setVerificationExpiry(LocalDateTime.now().plusMinutes(10));

        accountRepository.save(account);

        try {
            emailService.sendVerificationEmail(account.getEmail(), randomCode);
        } catch (Exception e) {
            System.err.println("Gửi mail thất bại: " + e.getMessage());
            return "Đăng ký thành công, nhưng gửi email thất bại. Vui lòng liên hệ admin.";
        }

        return "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.";
    }

    // --- 2. XÁC THỰC ---
    public void verifyUser(String email, String code) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new VerificationException("Không tìm thấy email này!"));

        if (account.isActive()) {
            throw new VerificationException("Tài khoản này đã kích hoạt rồi, vui lòng đăng nhập!");
        }

        if (!code.trim().equals(String.valueOf(account.getVerificationCode()).trim())) {
            throw new VerificationException("Mã xác thực không đúng!");
        }

        if (account.getVerificationExpiry() == null || LocalDateTime.now().isAfter(account.getVerificationExpiry())) {
            throw new VerificationException("Mã xác thực đã hết hạn!");
        }

        account.setActive(true);
        account.setVerificationCode(null);
        account.setVerificationExpiry(null);
        accountRepository.save(account);
    }

    // --- 3. ĐĂNG NHẬP ---
    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        var user = accountRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new RegistrationException("User không tồn tại"));

        if (!user.isActive()) {
            throw new VerificationException("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email!");
        }

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }
}
