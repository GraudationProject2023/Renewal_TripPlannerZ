package com.tripplannerz.domain.trip.dto;

public record TripItemResponse(
        Long id,
        int dayNumber,
        int sortOrder,
        String placeName,
        String memo,
        Long estimatedCost,
        Integer stayMinutes,
        Double latitude,
        Double longitude) {
}
