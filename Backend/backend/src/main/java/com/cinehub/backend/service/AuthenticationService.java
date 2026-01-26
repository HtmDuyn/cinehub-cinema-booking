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
import com.cinehub.backend.model.entity.AccountVerification;
import com.cinehub.backend.model.enums.Role;
import com.cinehub.backend.repository.AccountRepository;
import com.cinehub.backend.repository.AccountVerificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AccountRepository accountRepository;
    private final AccountVerificationRepository verificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // --- 1. ĐĂNG KÝ ---
    public AuthenticationResponse register(RegisterRequest request) {
        if (!request.isTermsAccepted()) {
            throw new RegistrationException("Vui lòng đồng ý với điều khoản sử dụng!");
        }

        // kiểm tra username
        var existingByUsername = accountRepository.findByUsername(request.getUsername());
        if (existingByUsername.isPresent() && existingByUsername.get().isActive()) {
            throw new RegistrationException("Lỗi: Username đã tồn tại!");
        }

        // kiểm tra email
        var existingByEmail = accountRepository.findByEmail(request.getEmail());
        if (existingByEmail.isPresent()) {
            Account acc = existingByEmail.get();
            if (acc.isActive()) {
                throw new RegistrationException("Lỗi: Email đã tồn tại!");
            } else {
                // --- ghi đè thông tin mới nếu chưa active ---
                acc.setUsername(request.getUsername());
                acc.setPassword(passwordEncoder.encode(request.getPassword()));
                acc.setPhoneNumber(request.getPhoneNumber());
                acc.setFullName(request.getFullName());
                acc.setDob(request.getDob());
                acc.setRole(Role.CUSTOMER);
                acc.setActive(false);
                acc.setMembershipScore(0);

                accountRepository.save(acc);

                // tạo record verification mới
                String randomCode = String.valueOf(new Random().nextInt(900000) + 100000);
                AccountVerification verification = AccountVerification.builder()
                        .account(acc)
                        .code(randomCode)
                        .expiry(LocalDateTime.now().plusMinutes(10))
                        .build();
                verificationRepository.save(verification);

                try {
                    emailService.sendVerificationEmail(acc.getEmail(), randomCode);
                } catch (Exception e) {
                    System.err.println("Gửi mail thất bại: " + e.getMessage());
                    return AuthenticationResponse.builder()
                            .token(null)
                            .id(acc.getId())
                            .username(acc.getUsername())
                            .role(acc.getRole().name())
                            .build();
                }

                return AuthenticationResponse.builder()
                        .token(null)
                        .id(acc.getId())
                        .username(acc.getUsername())
                        .role(acc.getRole().name())
                        .build();
            }
        }

        // --- tạo mới nếu chưa có ---
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

        accountRepository.save(account);

        // tạo record verification mới
        String randomCode = String.valueOf(new Random().nextInt(900000) + 100000);
        AccountVerification verification = AccountVerification.builder()
                .account(account)
                .code(randomCode)
                .expiry(LocalDateTime.now().plusMinutes(10))
                .build();
        verificationRepository.save(verification);

        try {
            emailService.sendVerificationEmail(account.getEmail(), randomCode);
        } catch (Exception e) {
            System.err.println("Gửi mail thất bại: " + e.getMessage());
            return AuthenticationResponse.builder()
                    .token(null)
                    .id(account.getId())
                    .username(account.getUsername())
                    .role(account.getRole().name())
                    .build();
        }

        return AuthenticationResponse.builder()
                .token(null)
                .id(account.getId())
                .username(account.getUsername())
                .role(account.getRole().name())
                .build();
    }

    // --- 2. XÁC THỰC ---
    public AuthenticationResponse verifyUser(String email, String code) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new VerificationException("Không tìm thấy email này!"));

        if (account.isActive()) {
            throw new VerificationException("Tài khoản này đã kích hoạt rồi, vui lòng đăng nhập!");
        }

        AccountVerification verification = verificationRepository.findTopByAccountOrderByCreatedAtDesc(account)
                .orElseThrow(() -> new VerificationException("Không tìm thấy mã xác thực!"));

        if (!code.trim().equals(verification.getCode().trim())) {
            throw new VerificationException("Mã xác thực không đúng!");
        }

        if (verification.getExpiry() == null || LocalDateTime.now().isAfter(verification.getExpiry())) {
            throw new VerificationException("Mã xác thực đã hết hạn!");
        }

        account.setActive(true);
        accountRepository.save(account);

        // xoá record verification sau khi thành công
        verificationRepository.delete(verification);

        var jwtToken = jwtService.generateToken(account);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .id(account.getId())
                .username(account.getUsername())
                .role(account.getRole().name())
                .build();
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

        return AuthenticationResponse.builder().token(jwtToken).id(user.getId()).username(user.getUsername())
                .role(user.getRole().name()).email(user.getEmail()).fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber()).membershipScore(user.getMembershipScore()).dob(user.getDob())
                .build();
    }

    // --- 4. Resend Verification Code ---
    public AuthenticationResponse resendVerificationCode(String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new VerificationException("Không tìm thấy email này!"));

        if (account.isActive()) {
            throw new VerificationException("Tài khoản đã kích hoạt, không cần resend!");
        }

        AccountVerification verification = verificationRepository
                .findTopByAccountOrderByCreatedAtDesc(account)
                .orElseThrow(() -> new VerificationException("Không tìm thấy mã xác thực!"));

        // Kiểm tra block spam
        if (verification.getBlockedUntil() != null
                && LocalDateTime.now().isBefore(verification.getBlockedUntil())) {
            throw new VerificationException("Bạn đã vượt quá số lần resend, vui lòng thử lại sau 30 phút!");
        }

        // Kiểm tra thời gian giữa các lần resend
        if (verification.getLastResendTime() != null
                && LocalDateTime.now().isBefore(verification.getLastResendTime().plusMinutes(1))) {
            throw new VerificationException("Bạn chỉ có thể resend sau 1 phút!");
        }

        // Kiểm tra số lần resend
        if (verification.getResendAttempts() >= 5) {
            verification.setBlockedUntil(LocalDateTime.now().plusMinutes(30));
            verificationRepository.save(verification);
            throw new VerificationException("Bạn đã vượt quá số lần resend, vui lòng thử lại sau 30 phút!");
        }

        // Tạo mã mới
        String randomCode = String.valueOf(new Random().nextInt(900000) + 100000);
        verification.setCode(randomCode);
        verification.setExpiry(LocalDateTime.now().plusMinutes(10));
        verification.setResendAttempts(verification.getResendAttempts() + 1);
        verification.setLastResendTime(LocalDateTime.now());

        verificationRepository.save(verification);

        try {
            emailService.sendVerificationEmail(account.getEmail(), randomCode);
        } catch (Exception e) {
            System.err.println("Gửi mail thất bại: " + e.getMessage());
        }

        return AuthenticationResponse.builder()
                .token(null) // chưa cấp token
                .id(account.getId())
                .username(account.getUsername())
                .role(account.getRole().name())
                .build();
    }

}
