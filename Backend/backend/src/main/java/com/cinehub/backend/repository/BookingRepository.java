package com.cinehub.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinehub.backend.model.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Lấy danh sách booking theo khoảng thời gian
    List<Booking> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Tính tổng doanh thu trong khoảng thời gian
    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenue(@Param("startDate") LocalDateTime startDate,
                               @Param("endDate") LocalDateTime endDate);

    // Lấy booking theo id (JpaRepository đã có sẵn findById, nhưng bạn có thể viết rõ ràng)
    Optional<Booking> findByBookingId(Long bookingId);
}

