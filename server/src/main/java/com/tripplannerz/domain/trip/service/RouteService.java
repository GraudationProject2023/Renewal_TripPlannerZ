package com.tripplannerz.domain.trip.service;

import com.tripplannerz.domain.trip.dto.RouteResponse;
import com.tripplannerz.domain.trip.dto.RouteResponse.RouteStop;
import com.tripplannerz.domain.trip.lib.GeoPoint;
import com.tripplannerz.domain.trip.lib.RouteOptimizer;
import com.tripplannerz.domain.trip.repository.TripItemRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RouteService {

    private final TripItemRepository tripItemRepository;
    private final TripService tripService;

    /** 해당 일차에서 좌표가 있는 장소들을 최근접 이웃으로 재배치한 결과를 반환한다(저장하지 않음). */
    public RouteResponse optimizeDay(Long tripId, Long memberId, int dayNumber) {
        tripService.getReadable(tripId, memberId); // 조회 권한 검증

        List<GeoPoint> points =
                tripItemRepository.findAllByTripIdOrderByDayNumberAscSortOrderAsc(tripId).stream()
                        .filter(item -> item.getDayNumber() == dayNumber && item.hasCoordinates())
                        .map(item -> new GeoPoint(
                                item.getId(), item.getPlaceName(),
                                item.getLatitude(), item.getLongitude()))
                        .toList();

        List<GeoPoint> ordered = RouteOptimizer.optimize(points);
        List<RouteStop> stops = ordered.stream()
                .map(p -> new RouteStop(p.itemId(), p.placeName(), p.latitude(), p.longitude()))
                .toList();
        return new RouteResponse(dayNumber, RouteOptimizer.totalDistanceKm(ordered), stops);
    }
}
