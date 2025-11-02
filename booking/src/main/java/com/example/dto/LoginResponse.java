package com.example.dto;

import org.springframework.http.HttpStatus;


public class LoginResponse extends DefaultResponse {
    private final String token;

    public LoginResponse(HttpStatus status, String message, String token) {
        super(status, message);
        this.token = token;
    }

    public String getToken() {
        return this.token;
    }
}
