package com.example.dto.responses;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DefaultResponse {
    private final HttpStatus status;
    private final String message;
}
