package com.example.exceptions;

public class UsernameAlreadyUsedException extends RuntimeException {
    public UsernameAlreadyUsedException() {
        super("Username уже используется");
    }   
}
