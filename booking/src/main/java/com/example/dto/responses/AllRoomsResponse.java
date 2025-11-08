package com.example.dto.responses;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.example.dto.RoomDto;

public class AllRoomsResponse extends DefaultResponse {
    private List<RoomDto> rooms;

    public AllRoomsResponse(HttpStatus status, String message, List<RoomDto> rooms) {
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
