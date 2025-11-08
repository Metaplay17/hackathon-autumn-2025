package com.example.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterRequest {
    @Email(message = "Неверный формат Email")
    @NotBlank(message = "Email не может быть пустым")
    private final String email;

    @NotBlank(message = "Username не может быть пустым")
    @Size(min = 3, max = 50, message = "Username должен быть от 3 до 50 символов в длину")
    private final String username;

    @NotBlank(message = "Пароль не может быть пустым")
    private final String password;
}
