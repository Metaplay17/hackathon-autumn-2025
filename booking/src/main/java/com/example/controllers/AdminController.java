package com.example.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.admin.UpdateBookingRequest;
import com.example.dto.admin.UpdateRoomRequest;
import com.example.dto.responses.DefaultResponse;
import com.example.models.User;
import com.example.services.BookingService;
import com.example.services.RoomService;
import com.example.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin")
public class AdminController {
    
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final RoomService roomService;
    private final BookingService bookingService;
    private final UserService userService;

    public AdminController(RoomService roomService, BookingService bookingService, UserService userService) {
        this.roomService = roomService;
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @PostMapping("/room/update")
    public ResponseEntity<DefaultResponse> updateRoom(Authentication authentication, @Valid @RequestBody UpdateRoomRequest request) {
        if (!userService.isAdmin((Integer)authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new DefaultResponse(HttpStatus.FORBIDDEN, "Данная функция доступна только администраторам"));
        }
        roomService.updateRoom(request);
        return ResponseEntity.ok(new DefaultResponse(HttpStatus.OK, "OK"));
    }

    @PostMapping("/booking/update")
    public ResponseEntity<DefaultResponse> updateBooking(Authentication authentication, @Valid @RequestBody UpdateBookingRequest request) {
        if (!userService.isAdmin((Integer)authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new DefaultResponse(HttpStatus.FORBIDDEN, "Данная функция доступна только администраторам"));
        }
        Optional<User> userOptional = userService.getUserByUsername(request.getUsername());
        bookingService.updateBooking(request, userOptional);
        return ResponseEntity.ok(new DefaultResponse(HttpStatus.OK, "OK"));
    }

    @GetMapping("/booking/generate")
    public ResponseEntity<DefaultResponse> generateBooking(Authentication authentication) {
        if (!userService.isAdmin((Integer)authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new DefaultResponse(HttpStatus.FORBIDDEN, "Данная функция доступна только администраторам"));
        }
        bookingService.generateBookings(LocalDate.now(), LocalDate.now().plusDays(1), LocalTime.of(9, 0), LocalTime.of(18, 0), 90);
        return ResponseEntity.ok(new DefaultResponse(HttpStatus.OK, "OK"));
    }
}
