package com.tripplannerz.domain.companion.dto;

import jakarta.validation.constraints.Size;

public record ApplicationCreateRequest(
        @Size(max = 500) String message) {
}
