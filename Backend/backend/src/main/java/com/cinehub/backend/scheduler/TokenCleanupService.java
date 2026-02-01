package com.cinehub.backend.scheduler;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.cinehub.backend.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;

    // Chạy mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredOrRevokedTokens() {
        refreshTokenRepository.deleteAllByRevokedTrueOrExpiryDateBefore(LocalDateTime.now());
    }
}
