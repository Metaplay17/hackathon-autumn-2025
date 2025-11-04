package com.example.controllers;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.BookingDto;
import com.example.dto.requests.MakeBookingRequest;
import com.example.dto.responses.BookingsFloorResponse;
import com.example.dto.responses.DefaultResponse;
import com.example.exceptions.UserNotFoundException;
import com.example.models.User;
import com.example.services.BookingService;
import com.example.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final BookingService bookingService;
    private final UserService userService;

    public BookingController(BookingService bookingService, UserService userService) {
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @GetMapping("/get/{floor}")
    public ResponseEntity<BookingsFloorResponse> getFloorBookings(@PathVariable Integer floor) {
        log.info("Запрос на получение слотов этажа = {}", floor);
        List<BookingDto> bookings = bookingService.getBookingsByFloor(floor);
        return ResponseEntity.ok(new BookingsFloorResponse(HttpStatus.OK, "OK", bookings));
    }

    @PostMapping("/make")
    public ResponseEntity<DefaultResponse> makeBooking(Authentication authentication, @Valid @RequestBody MakeBookingRequest request) {
        log.info("Запрос на бронирование слота bookingId={} от userId={}", request.getBookingId(), authentication.getPrincipal());
        Optional<User> userOptional = userService.getUserById((Integer)authentication.getPrincipal());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            bookingService.makeBooking(user, request);
            return ResponseEntity.ok(new DefaultResponse(HttpStatus.OK, "OK"));
        }
        else {
            log.error("Запрос от несуществующего пользователя");
            throw new UserNotFoundException("Пользователь не существует");
            // Требуется проработка отзыва токена при удалении пользователя из БД
        }
    }
}
