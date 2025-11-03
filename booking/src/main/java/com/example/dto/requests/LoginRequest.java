package com.example.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequest {
    @Email(message = "Неверный формат Email")
    @NotBlank(message = "Email не может быть пустым")
    private final String email;

    @NotBlank(message = "Пароль не может быть пустым")
    private final String password;
}
