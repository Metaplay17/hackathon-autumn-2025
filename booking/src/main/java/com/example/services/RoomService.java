package com.example.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.dto.RoomDto;
import com.example.dto.admin.UpdateRoomRequest;
import com.example.exceptions.RoomNotFoundException;
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
            roomDtos.add(new RoomDto(r.getId(), r.getNumber(), r.getDescription(), r.getCapability(), r.getFloor(), r.getIsOpen(), r.getPhoto()));
        }
        return roomDtos;
    }

    public List<RoomDto> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        List<RoomDto> roomDtos = new ArrayList<RoomDto>();
        for (Room r : rooms) {
            roomDtos.add(new RoomDto(r.getId(), r.getNumber(), r.getDescription(), r.getCapability(), r.getFloor(), r.getIsOpen(), r.getPhoto()));
        }
        return roomDtos;
    }

    public void updateRoom(UpdateRoomRequest request) {
        Optional<Room> roomOptional = roomRepository.findById(request.getRoomId());
        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            room.setCapability(request.getCapability());
            room.setIsOpen(request.getIsOpen());
            roomRepository.saveAndFlush(room);
        }
        else {
            throw new RoomNotFoundException("Комната с id = " + request.getRoomId() + " не найдена");
        }
    }
}
