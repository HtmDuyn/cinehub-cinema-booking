package com.cinehub.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.model.entity.AccountVerification;

@Repository
public interface AccountVerificationRepository extends JpaRepository<AccountVerification, Long> {

    // Lấy bản ghi verification mới nhất của một account
    Optional<AccountVerification> findTopByAccountOrderByCreatedAtDesc(Account account);

    Optional<AccountVerification> findByAccountAndCode(Account account, String code);

    // Nếu muốn xoá tất cả verification của một account (khi cleanup)
    void deleteByAccount(Account account);
}
