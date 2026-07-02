package com.tripplannerz.domain.companion.dto;

import com.tripplannerz.domain.companion.entity.ApplicationStatus;
import java.time.Instant;

public record ApplicationResponse(
        Long id,
        Long companionId,
        Long applicantId,
        String message,
        ApplicationStatus status,
        Instant createdAt) {
}
