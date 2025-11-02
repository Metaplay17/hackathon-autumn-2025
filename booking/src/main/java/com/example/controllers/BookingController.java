package com.example.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.BookingDto;
import com.example.dto.BookingsFloorResponse;
import com.example.services.BookingService;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/get/{floor}")
    public ResponseEntity<BookingsFloorResponse> getFloorBookings(@PathVariable Integer floor) {
        List<BookingDto> bookings = bookingService.getBookingsByFloor(floor);
        return ResponseEntity.ok(new BookingsFloorResponse(HttpStatus.OK, "OK", bookings));
    }
}
