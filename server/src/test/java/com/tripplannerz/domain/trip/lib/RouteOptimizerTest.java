package com.tripplannerz.domain.trip.lib;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** 프레임워크 비의존 순수 단위 테스트 — Docker 없이 기본 build에서 실행된다. */
class RouteOptimizerTest {

    @Test
    @DisplayName("하버사인: 서울-부산 약 325km")
    void haversine_seoul_to_busan() {
        double distance = RouteOptimizer.haversineKm(37.5665, 126.9780, 35.1796, 129.0756);
        assertThat(distance).isBetween(300.0, 340.0);
    }

    @Test
    @DisplayName("최근접 이웃: 시작점에서 가까운 순으로 정렬")
    void optimize_orders_by_nearest_neighbor() {
        GeoPoint a = new GeoPoint(1, "A", 0.0, 0.0);
        GeoPoint b = new GeoPoint(2, "B", 0.0, 1.0);
        GeoPoint c = new GeoPoint(3, "C", 0.0, 5.0);
        GeoPoint d = new GeoPoint(4, "D", 0.0, 2.0);

        // 입력 순서를 섞어도 A(첫 지점) → B → D → C 순이어야 한다.
        List<GeoPoint> ordered = RouteOptimizer.optimize(List.of(a, c, d, b));

        assertThat(ordered).extracting(GeoPoint::itemId).containsExactly(1L, 2L, 4L, 3L);
    }

    @Test
    @DisplayName("총 거리: 구간 합과 일치")
    void total_distance_sums_legs() {
        GeoPoint a = new GeoPoint(1, "A", 0.0, 0.0);
        GeoPoint b = new GeoPoint(2, "B", 0.0, 1.0);
        GeoPoint c = new GeoPoint(3, "C", 0.0, 2.0);

        double total = RouteOptimizer.totalDistanceKm(List.of(a, b, c));
        double expected =
                RouteOptimizer.haversineKm(0, 0, 0, 1) + RouteOptimizer.haversineKm(0, 1, 0, 2);

        assertThat(total).isCloseTo(expected, org.assertj.core.data.Offset.offset(1e-9));
    }
}
