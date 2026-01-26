package com.cinehub.backend.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account_verification")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết tới account
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    // Mã xác thực (OTP)
    @Column(length = 6, nullable = false)
    private String code;

    // Thời gian hết hạn mã
    @Column(nullable = false)
    private LocalDateTime expiry;

    // Số lần resend
    @Builder.Default
    @Column(name = "resend_attempts")
    private int resendAttempts = 0;

    // Thời điểm resend gần nhất
    @Column(name = "last_resend_time")
    private LocalDateTime lastResendTime;

    // Nếu vượt quá số lần thì chặn đến thời điểm này
    @Column(name = "blocked_until")
    private LocalDateTime blockedUntil;

    // Loại mã (EMAIL_VERIFY, PASSWORD_RESET, OTP_LOGIN...)
    @Builder.Default
    @Column(name = "type", length = 50)
    private String type = "EMAIL_VERIFY";

    // Audit fields
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Lifecycle hooks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
