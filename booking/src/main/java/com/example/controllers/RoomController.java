package com.example.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.FloorRoomsResponse;
import com.example.dto.RoomDto;
import com.example.services.RoomService;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/get/{floor}")
    public ResponseEntity<FloorRoomsResponse> getFloorRooms(@PathVariable Integer floor) {
        List<RoomDto> rooms = roomService.getAvailableFloorRooms(floor);
        FloorRoomsResponse response = new FloorRoomsResponse(HttpStatus.OK, "OK", rooms);
        return ResponseEntity.ok(response);
    }
}
