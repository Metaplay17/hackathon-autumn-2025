package com.example.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.models.Booking;
import com.example.models.Room;
import com.example.models.User;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Optional<Booking> findById(Integer id);
    List<Booking> findByUser(User user);
    List<Booking> findByRoom(Room room);

    @Query("SELECT b FROM Booking b WHERE b.start > CURRENT_TIMESTAMP AND b.room.id = :roomId")
    List<Booking> findByRoomIdAndActiveDate(Integer roomId);

    @Query("SELECT b FROM Booking b WHERE b.start > CURRENT_TIMESTAMP AND b.room.floor = :floor")
    List<Booking> findByFloorAndActiveDate(Integer floor);
}
