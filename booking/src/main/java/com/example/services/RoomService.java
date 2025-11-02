package com.example.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.dto.RoomDto;
import com.example.models.Room;
import com.example.repositories.RoomRepository;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    
    public List<RoomDto> getAvailableFloorRooms(Integer floor) {
        List<Room> rooms = roomRepository.findByFloor(floor);
        List<RoomDto> roomDtos = new ArrayList<RoomDto>();
        for (Room r : rooms) {
            roomDtos.add(new RoomDto(r.getId(), r.getName(), r.getCapability(), r.getFloor(), r.getIsOpen()));
        }
        return roomDtos;
    }
}
