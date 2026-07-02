package com.tripplannerz.domain.trip.lib;

/** 경로 최적화 계산용 좌표 점. */
public record GeoPoint(long itemId, String placeName, double latitude, double longitude) {
}
