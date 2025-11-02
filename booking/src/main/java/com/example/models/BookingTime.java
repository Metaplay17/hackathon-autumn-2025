package com.example.models;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingTime {
    private LocalTime startTime;
    private LocalTime endTime;
}
