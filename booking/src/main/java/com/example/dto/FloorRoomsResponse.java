package com.example.dto;

import java.util.List;

import org.springframework.http.HttpStatus;


public class FloorRoomsResponse extends DefaultResponse {
    private List<RoomDto> rooms;

    public FloorRoomsResponse(HttpStatus status, String message, List<RoomDto> rooms) {
        super(status, message);
        this.rooms = rooms;
    }

    public List<RoomDto> getRooms() {
        return this.rooms;
    }

    public void setRoom(List<RoomDto> newRooms) {
        this.rooms = newRooms;
    }
}
