package com.tripplannerz.domain.trip.dto;

import com.tripplannerz.domain.trip.entity.Visibility;
import java.time.Instant;
import java.time.LocalDate;

public record TripResponse(
        Long id,
        Long ownerId,
        String title,
        String destination,
        LocalDate startDate,
        LocalDate endDate,
        Long budget,
        Visibility visibility,
        Instant createdAt) {
}
