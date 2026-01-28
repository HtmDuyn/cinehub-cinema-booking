package com.cinehub.backend.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogoutService {

    private final RefreshTokenService refreshTokenService;

    public void logout(String refreshToken) {
        // Xử lý logout: revoke refresh token
        refreshTokenService.revoke(refreshToken);

        // Có thể thêm logic khác sau này:
        // - Ghi log hoạt động logout
        // - Xoá cache/session
        // - Audit bảo mật
    }
}
