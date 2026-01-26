package com.cinehub.backend.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.repository.AccountRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccountCleanupJob {

    private final AccountRepository accountRepository;

    // chạy mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanInactiveAccounts() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(10);
        List<Account> inactiveAccounts = accountRepository
                .findAllByIsActiveFalseAndCreatedAtBefore(cutoff);

        inactiveAccounts.forEach(acc -> {
            // Hard delete
            accountRepository.delete(acc);

            // Nếu muốn soft delete thì thay bằng:
            // acc.setDeletedAt(LocalDateTime.now());
            // accountRepository.save(acc);
        });

        System.out.println("Đã dọn " + inactiveAccounts.size() + " account chưa active trước " + cutoff);
    }
}

