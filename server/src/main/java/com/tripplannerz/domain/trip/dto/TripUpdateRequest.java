package com.tripplannerz.domain.trip.dto;

import com.tripplannerz.domain.trip.entity.Visibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TripUpdateRequest(
        @NotBlank @Size(max = 100) String title,
        @NotBlank @Size(max = 100) String destination,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @PositiveOrZero Long budget,
        @NotNull Visibility visibility) {
}
