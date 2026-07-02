package com.tripplannerz.domain.trip.service;

import com.tripplannerz.domain.trip.dto.RouteResponse;
import com.tripplannerz.domain.trip.dto.RouteResponse.RouteStop;
import com.tripplannerz.domain.trip.dto.TripResponse;
import com.tripplannerz.domain.trip.entity.TripItem;
import com.tripplannerz.domain.trip.lib.GeoPoint;
import com.tripplannerz.domain.trip.lib.RouteOptimizer;
import com.tripplannerz.domain.trip.repository.TripItemRepository;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
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

    /**
     * 최적화 결과를 실제 sort_order에 반영(저장)한다. 소유자만 가능.
     * 좌표가 있는 장소를 최적 순서로 0..k-1에 배치하고, 좌표 없는 장소는 그 뒤로 이어 붙인다.
     */
    @Transactional
    public RouteResponse applyOptimizedDay(Long tripId, Long memberId, int dayNumber) {
        TripResponse trip = tripService.getReadable(tripId, memberId);
        if (!trip.ownerId().equals(memberId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        List<TripItem> dayItems =
                tripItemRepository.findAllByTripIdOrderByDayNumberAscSortOrderAsc(tripId).stream()
                        .filter(item -> item.getDayNumber() == dayNumber)
                        .toList();

        List<GeoPoint> points = dayItems.stream()
                .filter(TripItem::hasCoordinates)
                .map(item -> new GeoPoint(
                        item.getId(), item.getPlaceName(), item.getLatitude(), item.getLongitude()))
                .toList();
        List<GeoPoint> ordered = RouteOptimizer.optimize(points);

        Map<Long, TripItem> byId = dayItems.stream()
                .collect(Collectors.toMap(TripItem::getId, Function.identity()));

        int sortOrder = 0;
        List<RouteStop> stops = new ArrayList<>();
        for (GeoPoint point : ordered) {
            byId.get(point.itemId()).moveTo(dayNumber, sortOrder++);
            stops.add(new RouteStop(
                    point.itemId(), point.placeName(), point.latitude(), point.longitude()));
        }
        // 좌표 없는 장소는 최적 구간 뒤로 유지
        for (TripItem item : dayItems) {
            if (!item.hasCoordinates()) {
                item.moveTo(dayNumber, sortOrder++);
            }
        }
        return new RouteResponse(dayNumber, RouteOptimizer.totalDistanceKm(ordered), stops);
    }
}
