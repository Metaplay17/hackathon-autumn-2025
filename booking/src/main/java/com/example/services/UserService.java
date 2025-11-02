package com.example.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.dto.LoginRequest;
import com.example.dto.RegisterRequest;
import com.example.exceptions.EmailAlreadyUsedException;
import com.example.exceptions.InvalidEmailPasswordCombinationException;
import com.example.exceptions.InvalidPasswordException;
import com.example.exceptions.UsernameAlreadyUsedException;
import com.example.models.User;
import com.example.repositories.UserRepository;
import com.example.util.PasswordHasher;
import com.example.util.Validator;

@Service
public class UserService {
    private UserRepository userRepository;
    private PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
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

    public Integer authUser(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordHasher.checkPassword(request.getPassword(), user.getPasswordHash())) {
                return user.getId();
            }
        }
        throw new InvalidEmailPasswordCombinationException();
    }
}
