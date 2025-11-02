package com.example.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.dto.DefaultResponse;
import com.example.exceptions.EmailAlreadyUsedException;
import com.example.exceptions.InvalidEmailPasswordCombinationException;
import com.example.exceptions.InvalidPasswordException;
import com.example.exceptions.UsernameAlreadyUsedException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<DefaultResponse> handleEmailAlreadyUsedException(EmailAlreadyUsedException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.BAD_REQUEST, "Email уже используется");
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(UsernameAlreadyUsedException.class)
    public ResponseEntity<DefaultResponse> handleUsernameAlreadyUserException(UsernameAlreadyUsedException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.BAD_REQUEST, "Username уже используется");
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<DefaultResponse> handleInvalidPasswordException(InvalidPasswordException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.BAD_REQUEST, "Длина пароля от 8 символов, должен содержать одну заглавную букву и одну цифру");
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(InvalidEmailPasswordCombinationException.class)
    public ResponseEntity<DefaultResponse> handleInvalidPasswordException(InvalidEmailPasswordCombinationException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.FORBIDDEN, "Не найдена указанная комбинация email + password");
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<DefaultResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder messages = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            messages.append(": ")
                    .append(error.getDefaultMessage())
                    .append("; ")
        );

        String message = messages.length() > 0 
            ? messages.substring(0, messages.length() - 2) // убрать последнюю "; "
            : "Validation failed";

        DefaultResponse response = new DefaultResponse(HttpStatus.BAD_REQUEST, message);
        return ResponseEntity.badRequest().body(response);
    }
}
