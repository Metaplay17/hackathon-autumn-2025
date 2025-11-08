package com.example.controllers;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.BookingDto;
import com.example.dto.ProfileDto;
import com.example.dto.responses.BookingHistoryResponse;
import com.example.dto.responses.ProfileResponse;
import com.example.services.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getId(Authentication authentication) {
        log.info("Запрос на получение профиля от userId={}", authentication.getPrincipal());
        Integer userId = (Integer)authentication.getPrincipal();
        ProfileDto profileDto = userService.getUserProfile(userId);
        return ResponseEntity.ok(new ProfileResponse(HttpStatus.OK, "OK", profileDto.getUsername(), profileDto.getBookings()));
    }

    @GetMapping("/booking-history")
    public ResponseEntity<BookingHistoryResponse> getBookingHistory(Authentication authentication) {
        log.info("Запрос на получение истории бронирований от userId={}", authentication.getPrincipal());
        Integer userId = (Integer)authentication.getPrincipal();
        List<BookingDto> bookingDtos = userService.getAllUserBookings(userId);
        return ResponseEntity.ok(new BookingHistoryResponse(HttpStatus.OK, "OK", bookingDtos));
    }
}
