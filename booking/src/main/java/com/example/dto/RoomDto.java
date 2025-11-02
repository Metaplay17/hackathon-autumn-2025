package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RoomDto {
    private int id;
    private String name;
    private int capability;
    private int floor;
    private boolean isOpen;
}
