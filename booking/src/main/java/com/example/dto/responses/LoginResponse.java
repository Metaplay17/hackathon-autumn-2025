package com.example.dto.responses;

import org.springframework.http.HttpStatus;


public class LoginResponse extends DefaultResponse {
    private String token;
    private Byte privilegeLevel;
    private String username;

    public LoginResponse(HttpStatus status, String message, String token, Byte privilegeLevel, String username) {
        super(status, message);
        this.token = token;
        this.privilegeLevel = privilegeLevel;
        this.username = username;
    }

    public String getToken() {
        return this.token;
    }

    public Byte getPrivilegeLevel() {
        return this.privilegeLevel;
    }

    public String getUsername() {
        return this.username;
    }
}
