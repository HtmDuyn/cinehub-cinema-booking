package com.cinehub.backend.service.Admin;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cinehub.backend.model.entity.Booking;
import com.cinehub.backend.model.entity.PaymentStatus;
import com.cinehub.backend.repository.BookingRepository;

@Service
public class ReportService {
    private final BookingRepository bookingRepository;

    public ReportService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public BigDecimal calculateRevenue(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        List<Booking> bookings = bookingRepository.findByCreatedAtBetween(start, end);
        return bookings.stream()
                       .filter(b -> b.getPaymentStatus() == PaymentStatus.SUCCESS)
                       .map(Booking::getTotalPrice)
                       .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Map<LocalDate, Long> countBookingsByDate() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                       .collect(Collectors.groupingBy(b -> b.getCreatedAt().toLocalDate(), Collectors.counting()));
    }
    public void notifyAllUsers() {
        // Giả sử chúng ta có một dịch vụ gửi thông báo
        // notificationService.notifyAllUsers("This is a notification to all users.");
        System.out.println("Notifications sent to all users.");
    }
}
