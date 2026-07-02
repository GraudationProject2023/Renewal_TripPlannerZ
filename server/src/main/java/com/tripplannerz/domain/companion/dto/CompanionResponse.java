package com.tripplannerz.domain.companion.dto;

import com.tripplannerz.domain.companion.entity.CompanionStatus;
import java.time.Instant;
import java.time.LocalDate;

public record CompanionResponse(
        Long id,
        Long hostId,
        Long tripId,
        String title,
        String content,
        String destination,
        LocalDate startDate,
        LocalDate endDate,
        int capacity,
        Long budget,
        CompanionStatus status,
        Instant createdAt) {
}
