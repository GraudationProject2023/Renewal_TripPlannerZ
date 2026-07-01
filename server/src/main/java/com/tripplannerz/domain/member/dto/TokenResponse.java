package com.tripplannerz.domain.member.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken) {
}
