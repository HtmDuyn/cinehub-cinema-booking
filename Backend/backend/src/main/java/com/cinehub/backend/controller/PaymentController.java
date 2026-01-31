package com.cinehub.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinehub.backend.dto.request.PaymentRequest;
import com.cinehub.backend.model.entity.Payment;
import com.cinehub.backend.model.entity.PaymentStatus;
import com.cinehub.backend.repository.BookingRepository;
import com.cinehub.backend.service.MomoService;
import com.cinehub.backend.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final MomoService momoService;
    private final BookingRepository bookingRepository;

    public PaymentController(PaymentService paymentService, MomoService momoService, BookingRepository bookingRepository) {
        this.paymentService = paymentService;
        this.momoService = momoService;
        this.bookingRepository = bookingRepository;
    }
@PostMapping("/momo")
public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
    try {
        Payment payment = paymentService.createPayment(request);
        String orderId = String.valueOf(payment.getPaymentId());

        return ResponseEntity.ok(Map.of(
            "orderId", orderId,
            "paymentUrl", "TEST_OK"
        ));
    } catch (Exception e) {
        e.printStackTrace(); // 🔥 BẮT BUỘC
        return ResponseEntity.status(500).body(e.getMessage());
    }
}





    // @PostMapping("/momo")
    // public ResponseEntity<?> createPayment(@RequestBody PaymentRequest paymentRequest) {
    //     Booking booking = bookingRepository.findById(paymentRequest.getBookingId())
    //         .orElseThrow(() -> new IllegalArgumentException("Invalid booking ID"));

    //     Payment payment = new Payment();
    //     payment.setBooking(booking);
    //     payment.setAmount(paymentRequest.getAmount());
    //     payment.setMethod(PaymentMethod.MOMO);
    //     payment.setStatus(PaymentStatus.PENDING);
    //     payment.setCreatedAt(java.time.LocalDateTime.now());

    //     // Lưu vào DB
    //     payment = paymentService.save(payment);

    //     // Dùng paymentId làm orderId
    //     String orderId = String.valueOf(payment.getPaymentId());

    //     // Gọi MoMo Sandbox
    //     String paymentUrl = momoService.createPayment(orderId, payment.getAmount().doubleValue());

    //     return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl, "orderId", orderId));
    // }

    @GetMapping("/success")
    public ResponseEntity<?> paymentSuccess(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok("Thanh toán thành công");
    }

    @PostMapping("/notify")
    public ResponseEntity<?> paymentNotify(@RequestBody Map<String, Object> payload) {
        String orderId = String.valueOf(payload.get("orderId"));
        String resultCode = String.valueOf(payload.get("resultCode"));
        String transId = String.valueOf(payload.get("transId"));

        Long paymentId = Long.parseLong(orderId);

        if ("0".equals(resultCode)) {
            paymentService.updatePaymentStatus(paymentId, PaymentStatus.SUCCESS, transId);
        } else {
            paymentService.updatePaymentStatus(paymentId, PaymentStatus.FAILED, transId);
        }

        return ResponseEntity.ok("Thông báo thanh toán nhận được");
    }
    @GetMapping("/ping")
public String ping() {
    return "PING_OK";
}

}
