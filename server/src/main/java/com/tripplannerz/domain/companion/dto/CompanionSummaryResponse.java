package com.tripplannerz.domain.companion.dto;

import com.tripplannerz.domain.companion.entity.CompanionStatus;
import java.time.LocalDate;

public record CompanionSummaryResponse(
        Long id,
        Long hostId,
        String title,
        String destination,
        LocalDate startDate,
        LocalDate endDate,
        int capacity,
        CompanionStatus status) {
}
