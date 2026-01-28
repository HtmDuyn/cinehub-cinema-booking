package com.cinehub.backend.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.model.entity.RefreshToken;
import com.cinehub.backend.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    // ✅ Tạo refresh token mới, đồng thời revoke token cũ của account
    public RefreshToken create(Account account) {
        // Revoke tất cả token cũ của account
        refreshTokenRepository.findByAccountAndRevokedFalse(account)
                .forEach(rt -> {
                    rt.setRevoked(true);
                    refreshTokenRepository.save(rt);
                });

        // Tạo token mới
        RefreshToken token = new RefreshToken();
        token.setAccount(account);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusDays(7));
        token.setRevoked(false);
        return refreshTokenRepository.save(token);
    }

    // ✅ Kiểm tra token hợp lệ
    public RefreshToken validate(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không tồn tại"));
        if (rt.isRevoked() || LocalDateTime.now().isAfter(rt.getExpiryDate())) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }
        return rt;
    }

    // ✅ Revoke token theo giá trị
    public void revoke(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }
}
