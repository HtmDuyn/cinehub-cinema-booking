package com.cinehub.backend.service;

import com.cinehub.backend.dto.request.LoginRequest;
import com.cinehub.backend.dto.request.RegisterRequest;
import com.cinehub.backend.dto.response.AuthenticationResponse;
import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.model.enums.Role;
import com.cinehub.backend.repository.AccountRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Account register(RegisterRequest request) {
        // 1. Kiểm tra Username đã tồn tại chưa
        if (accountRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Lỗi: Username đã tồn tại!");
        }

        // 2. Kiểm tra Email đã tồn tại chưa (Optional)
        // if (accountRepository.existsByEmail(request.getEmail())) { ... }

        // 3. Tạo Account mới từ Request
        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa pass
        account.setEmail(request.getEmail());
        account.setPhoneNumber(request.getPhoneNumber()); // Lưu số điện thoại
        account.setFullName(request.getFullName());

        account.setRole(Role.CUSTOMER); // Mặc định đăng ký là Khách hàng
        account.setActive(true); // Mặc định tài khoản được kích hoạt

        // 4. Lưu xuống Database
        return accountRepository.save(account);
    }

    // --- HÀM ĐĂNG NHẬP ---
    public AuthenticationResponse login(LoginRequest request) {
        // 1. Xác thực (Spring Security sẽ tự dùng logic ở Bước 2 để check)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), // Ở đây Frontend gửi username hoặc email đều được
                        request.getPassword()));

        // 2. Tìm user trong DB (SỬA ĐOẠN NÀY)
        var user = accountRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // 3. Sinh Token (Giữ nguyên)
        var jwtToken = jwtService.generateToken(user);

        // 4. Trả vé về (Giữ nguyên)
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }
}
