package com.example.repositories;

import org.springframework.stereotype.Repository;

import com.example.models.Room;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Optional<Room> findById(Integer id);
    List<Room> findByFloor(Integer floor);
}
