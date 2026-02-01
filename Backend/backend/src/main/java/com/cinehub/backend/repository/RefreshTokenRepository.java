package com.cinehub.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.model.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByAccount(Account account);

    void deleteByToken(String token);

    List<RefreshToken> findByAccountAndRevokedFalse(Account account);

    void deleteAllByRevokedTrueOrExpiryDateBefore(LocalDateTime now);

}
