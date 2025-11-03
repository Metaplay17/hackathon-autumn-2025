package com.example.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.dto.DefaultResponse;
import com.example.exceptions.BookingAlreadyUsedException;
import com.example.exceptions.BookingNotFoundException;
import com.example.exceptions.EmailAlreadyUsedException;
import com.example.exceptions.InvalidEmailPasswordCombinationException;
import com.example.exceptions.InvalidPasswordException;
import com.example.exceptions.RoomNotFoundException;
import com.example.exceptions.UserNotFoundException;
import com.example.exceptions.UsernameAlreadyUsedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<DefaultResponse> handleEmailAlreadyUsedException(EmailAlreadyUsedException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.BAD_REQUEST, "Email уже используется");
        log.warn(ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(UsernameAlreadyUsedException.class)
    public ResponseEntity<DefaultResponse> handleUsernameAlreadyUserException(UsernameAlreadyUsedException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.BAD_REQUEST, "Username уже используется");
        log.warn(ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<DefaultResponse> handleInvalidPasswordException(InvalidPasswordException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.BAD_REQUEST, "Длина пароля от 8 символов, должен содержать одну заглавную букву и одну цифру");
        log.warn(ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(InvalidEmailPasswordCombinationException.class)
    public ResponseEntity<DefaultResponse> handleInvalidPasswordException(InvalidEmailPasswordCombinationException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.FORBIDDEN, "Не найдена указанная комбинация email + password");
        log.warn(ex.getMessage());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<DefaultResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder messages = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            messages.append(error.getDefaultMessage())
                    .append("; ")
        );

        String message = messages.length() > 0 
            ? messages.substring(0, messages.length() - 2) // убрать последнюю "; "
            : "Validation failed";

        DefaultResponse response = new DefaultResponse(HttpStatus.BAD_REQUEST, message);
        log.warn(message);
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<DefaultResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = "Неверный формат JSON, попробуйте проверить типы данных";
        
        log.warn("JSON parse error", ex.getMessage());
        
        return ResponseEntity.badRequest()
                .body(new DefaultResponse(HttpStatus.BAD_REQUEST, message));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<DefaultResponse> handleUserNotFoundException(UserNotFoundException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.NOT_FOUND, ex.getMessage());
        log.warn(ex.getMessage());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<DefaultResponse> handleBookingNotFoundException(BookingNotFoundException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.NOT_FOUND, ex.getMessage());
        log.warn(ex.getMessage());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<DefaultResponse> handleRoomNotFoundException(RoomNotFoundException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.NOT_FOUND, ex.getMessage());
        log.warn(ex.getMessage());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(BookingAlreadyUsedException.class)
    public ResponseEntity<DefaultResponse> handleRoomNotFoundException(BookingAlreadyUsedException ex) {
        DefaultResponse response = new DefaultResponse(HttpStatus.CONFLICT, ex.getMessage());
        log.warn(ex.getMessage());
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
