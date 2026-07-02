package com.tripplannerz.domain.trip.dto;

import com.tripplannerz.domain.trip.entity.Visibility;
import java.time.LocalDate;

public record TripSummaryResponse(
        Long id,
        String title,
        String destination,
        LocalDate startDate,
        LocalDate endDate,
        Visibility visibility) {
}
