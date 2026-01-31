package com.cinehub.backend.dto.request;

import java.math.BigDecimal;

import com.cinehub.backend.model.entity.PaymentMethod;
public class PaymentRequest {

    private Long bookingId;
    private BigDecimal amount;
    private PaymentMethod method;
    private String idempotencyKey;

    public Long getBookingId() {
        return bookingId;
    }
    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getMethod() {
        return method;
    }
    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }
    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }
}
