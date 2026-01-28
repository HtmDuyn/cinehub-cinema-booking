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

    public RefreshToken create(Account account) {
        RefreshToken token = new RefreshToken();
        token.setAccount(account);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusDays(7));
        token.setRevoked(false);
        return refreshTokenRepository.save(token);
    }

    public RefreshToken validate(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không tồn tại"));
        if (rt.isRevoked() || LocalDateTime.now().isAfter(rt.getExpiryDate())) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }
        return rt;
    }

    public void revoke(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }
}
