package com.example.dto.responses;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.example.dto.BookingDto;

public class AllBookingsResponse extends DefaultResponse {
    private List<BookingDto> bookings;

    public AllBookingsResponse(HttpStatus status, String message, List<BookingDto> bookings) {
        super(status, message);
        this.bookings = bookings;
    }

    public List<BookingDto> getBookings() {
        return this.bookings;
    }

    public void setBookings(List<BookingDto> newBookings) {
        this.bookings = newBookings;
    }
}
