package com.tripplannerz.domain.chat.dto;

import java.time.Instant;

public record ChatMessageResponse(
        Long id,
        Long roomId,
        Long senderId,
        String content,
        Instant createdAt) {
}
