package com.cinehub.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.model.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByAccount(Account account);

    void deleteByToken(String token);
}
