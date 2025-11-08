package com.example.dto.responses;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.example.dto.BookingDto;

public class BookingHistoryResponse extends DefaultResponse {
    private List<BookingDto> bokingDtos;

    public BookingHistoryResponse(HttpStatus status, String message, List<BookingDto> bookingDtos) {
        super(status, message);
        this.bokingDtos = bookingDtos;
    }

    public List<BookingDto> getBookingDtos() {
        return this.bokingDtos;
    }
}
