package com.tripplannerz.domain.trip.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record TripItemCreateRequest(
        @NotNull @Positive Integer dayNumber,
        @NotNull @PositiveOrZero Integer sortOrder,
        @NotBlank @Size(max = 200) String placeName,
        String memo,
        @PositiveOrZero Long estimatedCost,
        @PositiveOrZero Integer stayMinutes,
        @DecimalMin("-90.0") @DecimalMax("90.0") Double latitude,
        @DecimalMin("-180.0") @DecimalMax("180.0") Double longitude) {
}
