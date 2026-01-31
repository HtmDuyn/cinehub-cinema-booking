package com.cinehub.backend.repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinehub.backend.model.entity.Account;


@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    // Tìm kiếm theo username
    Optional<Account> findByUsername(String username);

    // Tìm kiếm theo email
    Optional<Account> findByEmail(String email);

    // Tìm kiếm username HOẶC email (để login 2 trong 1)
    Optional<Account> findByUsernameOrEmail(String username, String email);

    // Kiểm tra tồn tại (để chặn đăng ký trùng)
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<Account> findAllByIsActiveFalseAndCreatedAtBefore(LocalDateTime cutoff);

 
}       