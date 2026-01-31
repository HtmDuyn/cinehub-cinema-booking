package com.cinehub.backend.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinehub.backend.dto.request.BookingRequest;
import com.cinehub.backend.model.entity.Booking;
import com.cinehub.backend.repository.BookingRepository;
@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(BookingRequest request) {
        Booking booking = new Booking();
        booking.setTotalTicketQty(request.getTotalTicketQty());
        // booking.setNote(request.getNote());
        booking.setCreatedAt(LocalDateTime.now());
        // booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }
}
    
