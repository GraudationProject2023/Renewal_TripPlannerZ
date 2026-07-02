package com.tripplannerz.domain.companion.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CompanionUpdateRequest(
        @NotBlank @Size(max = 100) String title,
        String content,
        @NotBlank @Size(max = 100) String destination,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotNull @Min(2) Integer capacity,
        @PositiveOrZero Long budget,
        Long tripId) {
}
