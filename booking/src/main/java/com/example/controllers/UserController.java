package com.example.controllers;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.DefaultResponse;
import com.example.services.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/id")
    public ResponseEntity<DefaultResponse> getId(Authentication authentication) {
        Integer userId = (Integer)authentication.getPrincipal();
        return ResponseEntity.ok(new DefaultResponse(HttpStatus.OK, userId.toString()));
    }
}
