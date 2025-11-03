package com.example.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.dto.BookingProfileDto;
import com.example.dto.ProfileDto;
import com.example.dto.requests.LoginRequest;
import com.example.dto.requests.RegisterRequest;
import com.example.exceptions.EmailAlreadyUsedException;
import com.example.exceptions.InvalidEmailPasswordCombinationException;
import com.example.exceptions.InvalidPasswordException;
import com.example.exceptions.UserNotFoundException;
import com.example.exceptions.UsernameAlreadyUsedException;
import com.example.models.Booking;
import com.example.models.User;
import com.example.repositories.BookingRepository;
import com.example.repositories.UserRepository;
import com.example.util.PasswordHasher;
import com.example.util.Validator;

@Service
public class UserService {
    private UserRepository userRepository;
    private BookingRepository bookingRepository;
    private PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, BookingRepository bookingRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.passwordHasher = passwordHasher;
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyUsedException();
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyUsedException();
        }
        if (!Validator.validatePassword(request.getPassword())) {
            throw new InvalidPasswordException();
        }
        String passwordHash = passwordHasher.hashPassword(request.getPassword());
        User newUser = new User(request.getEmail(), request.getUsername(), passwordHash);
        userRepository.save(newUser);
    }

    public User authUser(LoginRequest request) {
        if (!Validator.validatePassword(request.getPassword())) {
            throw new InvalidPasswordException();
        }
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordHasher.checkPassword(request.getPassword(), user.getPasswordHash())) {
                return user;
            }
        }
        throw new InvalidEmailPasswordCombinationException();
    }

    public boolean isAdmin(int userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getPrivilegeLevel() >= 3;
        }
        return false;
    }

    public ProfileDto getUserProfile(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<BookingProfileDto> bookings = getActiveUserBookings(userId);
            ProfileDto profileDto = new ProfileDto(user.getUsername(), bookings);
            return profileDto;
        }
        throw new UserNotFoundException("Пользователь не существует");
        // Удаление пользователя требует реализации отзыва токена
    }

    private List<BookingProfileDto> getActiveUserBookings(Integer userId) {
        List<Booking> bookings = bookingRepository.findActiveUserBookings(userId);
        List<BookingProfileDto> bookingDtos = new ArrayList<BookingProfileDto>();
        for (Booking b : bookings) {
            bookingDtos.add(new BookingProfileDto(
                b.getId(), 
                b.getRoom().getFloor().toString() + "-" + b.getRoom().getNumber().toString(), 
                b.getStart(),
                b.getDurationMinutes())
            );
        }
        return bookingDtos;
    }
}
