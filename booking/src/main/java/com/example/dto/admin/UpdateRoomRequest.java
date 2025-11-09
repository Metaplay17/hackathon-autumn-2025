package com.example.dto.admin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UpdateRoomRequest {
    @NotNull(message = "id комнаты не задан")
    @Min(value = 1, message = "id комнаты - положительное число")
    private Integer roomId;

    @NotNull(message = "Вместимость не задана")
    @Min(value = 1, message = "Вместимость комнаты - положительное число")
    private Integer capability;

    @NotNull(message = "Статус комнаты не задан")
    private Boolean isOpen;
}
