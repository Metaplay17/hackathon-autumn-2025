package com.example.exceptions;

public class InvalidEmailPasswordCombinationException extends RuntimeException {
    public InvalidEmailPasswordCombinationException() {
        super("Неверная комбинация логина и пароля");
    }
}
