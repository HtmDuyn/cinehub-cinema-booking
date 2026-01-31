package com.cinehub.backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cinehub.backend.dto.request.PaymentRequest;
import com.cinehub.backend.model.entity.Booking;
import com.cinehub.backend.model.entity.Payment;
import com.cinehub.backend.model.entity.PaymentStatus;
import com.cinehub.backend.repository.BookingRepository;
import com.cinehub.backend.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    /**
     * Tạo payment ban đầu (CHƯA có transactionRef)
     */
    public Payment createPayment(PaymentRequest request) {

    System.out.println(">>> service hit");

    Booking booking = bookingRepository
        .findById(request.getBookingId())
        .orElseThrow(() -> new RuntimeException("Booking not found"));

    System.out.println(">>> booking found id = " + booking.getBookingId());
        System.out.println(">>> method = " + request.getMethod());

    Payment payment = new Payment();
    payment.setBooking(booking);
    payment.setAmount(request.getAmount());
    payment.setMethod(request.getMethod());
    payment.setStatus(PaymentStatus.PENDING);
    payment.setIdempotencyKey(request.getIdempotencyKey());
    payment.setTransactionId("TXN-" + System.currentTimeMillis());
    Payment saved = paymentRepository.save(payment);

    System.out.println(">>> payment saved id = " + saved.getPaymentId());

    return saved;
}

    // @Transactional
    // public Payment createPayment(PaymentRequest request) {

    //     // 1️⃣ Idempotency check
    //     Optional<Payment> existed =
    //             paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
    //     if (existed.isPresent()) {
    //         return existed.get();
    //     }

    //     // 2️⃣ Lấy booking
    //     Booking booking = bookingRepository.findById(request.getBookingId())
    //             .orElseThrow(() -> new IllegalArgumentException("Invalid booking ID"));

    //     // 3️⃣ Không cho thanh toán lại
    //     if (booking.getPaymentStatus() == PaymentStatus.SUCCESS) {
    //         throw new IllegalStateException("Booking already paid");
    //     }

    //     // 4️⃣ Tạo payment
    //     Payment payment = new Payment();
    //     payment.setBooking(booking);
    //     payment.setAmount(request.getAmount());
    //     payment.setMethod(request.getMethod());
    //     payment.setStatus(PaymentStatus.PENDING);
    //     payment.setIdempotencyKey(request.getIdempotencyKey());
    //     payment.setCreatedAt(LocalDateTime.now());

    //     // ❌ KHÔNG set transactionRef ở đây
    //     Payment savedPayment = paymentRepository.save(payment);

    //     // 5️⃣ Update booking status = PENDING
    //     booking.setPaymentStatus(PaymentStatus.PENDING);
    //     bookingRepository.save(booking);

    //     return savedPayment;
    // }

    /**
     * MoMo callback cập nhật kết quả thanh toán
     */
    @Transactional
    public void updatePaymentStatus(Long paymentId,
                                    PaymentStatus status,
                                    String transactionRef) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid payment ID"));

        payment.setStatus(status);
        payment.setTransactionId(transactionRef);
        payment.setUpdatedAt(LocalDateTime.now());

        paymentRepository.save(payment);

        // Nếu thanh toán thành công → update booking
        if (status == PaymentStatus.SUCCESS) {
            Booking booking = payment.getBooking();
            booking.setPaymentStatus(PaymentStatus.SUCCESS);
            bookingRepository.save(booking);
        }  
    }
}
