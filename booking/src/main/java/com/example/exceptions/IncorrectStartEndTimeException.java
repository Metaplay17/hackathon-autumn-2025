package com.example.exceptions;

public class IncorrectStartEndTimeException extends RuntimeException {
    public IncorrectStartEndTimeException(String message) {
        super(message);
    }
}
