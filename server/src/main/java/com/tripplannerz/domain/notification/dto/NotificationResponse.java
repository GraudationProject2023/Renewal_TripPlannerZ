package com.tripplannerz.domain.notification.dto;

import com.tripplannerz.domain.notification.entity.NotificationType;
import java.time.Instant;

public record NotificationResponse(
        Long id,
        NotificationType type,
        String message,
        Long relatedId,
        boolean read,
        Instant createdAt) {
}
