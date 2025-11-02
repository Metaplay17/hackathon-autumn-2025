package com.example.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateBookingRequest {
    @NotNull(message = "id брони не задан")
    private Integer bookingId;

    @NotNull(message = "username не задан")
    @NotBlank
    private String username;
}
