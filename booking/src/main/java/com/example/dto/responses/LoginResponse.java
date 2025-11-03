package com.example.dto.responses;

import org.springframework.http.HttpStatus;


public class LoginResponse extends DefaultResponse {
    private String token;
    private Byte privilegeLevel;

    public LoginResponse(HttpStatus status, String message, String token, Byte privilegeLevel) {
        super(status, message);
        this.token = token;
        this.privilegeLevel = privilegeLevel;
    }

    public String getToken() {
        return this.token;
    }

    public Byte getPrivilegeLevel() {
        return this.privilegeLevel;
    }
}
