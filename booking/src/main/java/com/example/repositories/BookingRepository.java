package com.example.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.models.Booking;
import com.example.models.Room;
import com.example.models.User;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Optional<Booking> findById(Integer id);
    List<Booking> findByUser(User user);
    List<Booking> findByRoom(Room room);

    @Query("SELECT b FROM Booking b " +
        "WHERE FUNCTION('date', b.start) >= CURRENT_DATE " +
        "AND b.room.id = :roomId")
    List<Booking> findByRoomIdAndActiveDate(Integer roomId);

    @Query("SELECT b FROM Booking b " +
        "WHERE FUNCTION('date', b.start) >= CURRENT_DATE " +
        "AND b.room.floor = :floor")
    List<Booking> findByFloorAndActiveDate(Integer floor);

    @Modifying
    @Query(value = """
        INSERT INTO bookings (user_id, room_id, start, duration_minutes)
        VALUES (:userId, :roomId, :start, :durationMinutes)
        ON CONFLICT (room_id, start) DO NOTHING
        """, nativeQuery = true)
    void insertIfNotExists(
        @Param("userId") Integer userId,
        @Param("roomId") Integer roomId,
        @Param("start") LocalDateTime start,
        @Param("durationMinutes") Integer durationMinutes
    );

    @Query(value = """
        SELECT b.* FROM bookings b
        WHERE b.user_id = :userId
        AND CURRENT_TIMESTAMP <= (b.start + (b.duration_minutes * INTERVAL '1 minute'))
        """, nativeQuery = true)
    List<Booking> findActiveUserBookings(Integer userId);
}
