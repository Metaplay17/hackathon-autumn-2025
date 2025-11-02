package com.example.exceptions;

public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException() {
        super("Длина пароля от 8 символов, должен содержать одну заглавную букву и одну цифру");
    }
    
}
