package com.example.exceptions;

public class BookingAlreadyUsedException extends RuntimeException {
    public BookingAlreadyUsedException(String message) {
        super(message);
    }
}
