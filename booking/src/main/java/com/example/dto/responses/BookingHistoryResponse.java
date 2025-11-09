package com.example.dto.responses;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.example.dto.BookingProfileDto;

public class BookingHistoryResponse extends DefaultResponse {
    private List<BookingProfileDto> bookingDtos;

    public BookingHistoryResponse(HttpStatus status, String message, List<BookingProfileDto> bookingDtos) {
        super(status, message);
        this.bookingDtos = bookingDtos;
    }

    public List<BookingProfileDto> getBookingDtos() {
        return this.bookingDtos;
    }
}
