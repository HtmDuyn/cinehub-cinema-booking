package com.cinehub.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinehub.backend.model.entity.Payment;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // tìm kiếm payment theo orderId
    // orderId là mã đơn hàng do hệ thống của CineHub tạo ra và gửi sang MoMo khi khởi tạo thanh toán
    // Optional <Payment> findByOrderId(String orderId);
    // tìm theo bookingId
    Optional <Payment> findByBooking_BookingId (Long bookingId);
    // tìm theo transactionId
    Optional <Payment> findByTransactionId (String transactionId);

    Optional<Payment> findByIdempotencyKey(String key);
}

