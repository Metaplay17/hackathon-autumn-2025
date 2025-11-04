package com.example.dto.admin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GenerateTokenRequest {
    @NotNull(message = "Telegram ID не задан")
    @Min(10000)
    private Long telegramId;
}
