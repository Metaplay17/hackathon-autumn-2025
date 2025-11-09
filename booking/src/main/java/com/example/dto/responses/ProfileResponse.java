package com.example.dto.responses;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.example.dto.BookingProfileDto;


public class ProfileResponse extends DefaultResponse {
    private String username;
    private List<BookingProfileDto> bookings;

    public ProfileResponse(HttpStatus status, String message, String username, List<BookingProfileDto> bookings) {
        super(status, message);
        this.username = username;
        this.bookings = bookings;
    }

    public String getUsername() {
        return this.username;
    }
    public void setUsername(String newUsername) {
        this.username = newUsername;
    }

    public List<BookingProfileDto> getBookings() {
        return this.bookings;
    }
    public void setBookings(List<BookingProfileDto> newBookings) {
        this.bookings = newBookings;
    }
}
