package com.example.repositories;

import org.springframework.stereotype.Repository;

import com.example.models.Room;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Optional<Room> findById(Integer id);
    List<Room> findByFloor(Integer floor);

    @Query("SELECT r.id FROM Room r WHERE r.isOpen = true")
    List<Integer> findAllOpenId();
}
