package com.cinehub.backend.model.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long bookingId;
    @ManyToOne 
    @JoinColumn(name = "customer_account_id")
    private Account  customerAccountId;

    @ManyToOne
    @JoinColumn(name = "staff_account_id")
    private Account  staffAccountId;
    
    // @ManyToOne
    // @JoinColumn(name = "showtime_id")
    // private Showtime  showtimeId;

    @Column(name = "total_ticket_qty")
    private int totalTicketQty;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "idempotency_key")
    private String idempotencyKey;

    // === Constructors ===
    public Booking() {}

    public Booking(Long bookingId) {
        this.bookingId = bookingId;
    }

    // === Getters & Setters ===
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Account getCustomerAccountId() { return customerAccountId; }
    public void setCustomerAccountId(Account customerAccountId) { this.customerAccountId = customerAccountId; }

    public Account getStaffAccountId() { return staffAccountId; }
    public void setStaffAccountId(Account staffAccountId) { this.staffAccountId = staffAccountId; }

    // public Showtime getShowtimeId() { return showtimeId; }
    // public void setShowtimeId(Showtime showtimeId) { this.showtimeId = showtimeId; }

    public int getTotalTicketQty() { return totalTicketQty; }
    public void setTotalTicketQty(int totalTicketQty) { this.totalTicketQty = totalTicketQty; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
}
