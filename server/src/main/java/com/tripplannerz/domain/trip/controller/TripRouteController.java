package com.tripplannerz.domain.trip.controller;

import com.tripplannerz.domain.trip.dto.RouteResponse;
import com.tripplannerz.domain.trip.service.RouteService;
import com.tripplannerz.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/route")
@RequiredArgsConstructor
public class TripRouteController {

    private final RouteService routeService;

    /** 최적화 미리보기(저장하지 않음). */
    @GetMapping
    public ApiResponse<RouteResponse> preview(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long tripId,
            @RequestParam int day) {
        return ApiResponse.onSuccess(routeService.optimizeDay(tripId, memberId, day));
    }

    /** 최적화 결과를 순서에 반영(저장). 소유자만. */
    @PostMapping("/optimize")
    public ApiResponse<RouteResponse> applyOptimize(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long tripId,
            @RequestParam int day) {
        return ApiResponse.onSuccess(routeService.applyOptimizedDay(tripId, memberId, day));
    }
}
