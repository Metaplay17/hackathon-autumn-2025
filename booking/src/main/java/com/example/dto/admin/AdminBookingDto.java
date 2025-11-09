package com.example.dto.admin;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminBookingDto {
    private Integer id;
    private String username;
    private Boolean isOwner;
    private Boolean isFree;
    private Integer roomId;
    private LocalDateTime start;
    private Integer durationMinutes;
}
