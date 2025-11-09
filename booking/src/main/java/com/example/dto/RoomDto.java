package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RoomDto {
    private Integer id;
    private Integer number;
    private String description;
    private Integer capability;
    private Integer floor;
    private boolean isOpen;
    private String photo;
}
