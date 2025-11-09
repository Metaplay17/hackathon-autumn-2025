package com.example.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingDto {
    private Integer id;
    private Boolean isOwner;
    private Boolean isFree;
    private Integer roomId;
    private LocalDateTime start;
    private Integer durationMinutes;
}
