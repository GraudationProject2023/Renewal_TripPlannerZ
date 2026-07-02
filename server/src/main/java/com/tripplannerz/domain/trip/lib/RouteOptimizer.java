package com.tripplannerz.domain.trip.lib;

import java.util.ArrayList;
import java.util.List;

/** 하버사인 거리 기반 경로 최적화. 프레임워크 비의존 순수 로직. */
public final class RouteOptimizer {

    private static final double EARTH_RADIUS_KM = 6371.0088;

    private RouteOptimizer() {}

    /** 두 좌표 간 대권 거리(km). */
    public static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1.0, Math.sqrt(a)));
    }

    /** 첫 지점에서 시작해 최근접 이웃(greedy)으로 방문 순서를 정한다. */
    public static List<GeoPoint> optimize(List<GeoPoint> points) {
        if (points.size() <= 2) {
            return new ArrayList<>(points);
        }
        List<GeoPoint> remaining = new ArrayList<>(points);
        List<GeoPoint> ordered = new ArrayList<>();
        GeoPoint current = remaining.remove(0);
        ordered.add(current);
        while (!remaining.isEmpty()) {
            GeoPoint next = remaining.get(0);
            double best = Double.MAX_VALUE;
            for (GeoPoint candidate : remaining) {
                double distance = haversineKm(
                        current.latitude(), current.longitude(),
                        candidate.latitude(), candidate.longitude());
                if (distance < best) {
                    best = distance;
                    next = candidate;
                }
            }
            ordered.add(next);
            remaining.remove(next);
            current = next;
        }
        return ordered;
    }

    /** 순서대로 이어지는 구간 거리의 합(km). */
    public static double totalDistanceKm(List<GeoPoint> ordered) {
        double total = 0;
        for (int i = 1; i < ordered.size(); i++) {
            GeoPoint from = ordered.get(i - 1);
            GeoPoint to = ordered.get(i);
            total += haversineKm(from.latitude(), from.longitude(), to.latitude(), to.longitude());
        }
        return total;
    }
}
