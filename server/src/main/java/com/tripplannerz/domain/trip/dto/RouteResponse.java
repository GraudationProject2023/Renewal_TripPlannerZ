package com.tripplannerz.domain.trip.dto;

import java.util.List;

/** 특정 일차의 최적화된 방문 순서와 총 이동 거리(km). */
public record RouteResponse(
        int dayNumber,
        double totalDistanceKm,
        List<RouteStop> stops) {

    public record RouteStop(Long itemId, String placeName, double latitude, double longitude) {
    }
}
