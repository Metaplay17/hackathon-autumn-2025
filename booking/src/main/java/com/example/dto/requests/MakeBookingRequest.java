package com.example.dto.requests;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MakeBookingRequest {
    @NotNull(message = "id брони не задан")
    private Integer bookingId;
}
