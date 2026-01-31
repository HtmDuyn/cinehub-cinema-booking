package com.cinehub.backend.controller;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinehub.backend.service.Admin.ReportService;

@Service
@RestController
@RequestMapping("/api/admin/reports")
public class AdReportController {
    private final ReportService reportService;
    public AdReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    @GetMapping("/revenue")
    public ResponseEntity <BigDecimal> getRevenue(@RequestParam LocalDate startDate,@RequestParam LocalDate endDate){
        return ResponseEntity.ok(reportService.calculateRevenue(startDate, endDate));
    }
    @GetMapping("/bookings-by-date")
    public ResponseEntity <Map<LocalDate, Long>> getBookingsByDate(){
        return ResponseEntity.ok(reportService.countBookingsByDate());
    }
    @GetMapping("/notify-all")
    public ResponseEntity <String> notifyAllUsers(){
        reportService.notifyAllUsers();
        return ResponseEntity.ok("Notifications sent to all users.");
    }
    
    
}
