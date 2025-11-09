package com.example.dto.requests;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CancelBookingRequest {
    @NotNull(message = "id брони не задан")
    private Integer bookingId;
}
