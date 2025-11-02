package com.example.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingDto {
    private int id;
    private String username;
    private int roomId;
    private LocalDateTime start;
    private int durationMinutes;
}
