package com.example.dto.admin;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.example.dto.responses.DefaultResponse;

public class AdminBookingsFloorResponse extends DefaultResponse {
    private List<AdminBookingDto> bookings;

    public AdminBookingsFloorResponse(HttpStatus status, String message, List<AdminBookingDto> bookings) {
        super(status, message);
        this.bookings = bookings;
    }

    public List<AdminBookingDto> getBookings() {
        return this.bookings;
    }

    public void setBookings(List<AdminBookingDto> newBookings) {
        this.bookings = newBookings;
    }
}
