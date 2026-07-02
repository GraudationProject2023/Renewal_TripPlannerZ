package com.tripplannerz.domain.trip.controller;

import com.tripplannerz.domain.trip.dto.TripCreateRequest;
import com.tripplannerz.domain.trip.dto.TripResponse;
import com.tripplannerz.domain.trip.dto.TripSummaryResponse;
import com.tripplannerz.domain.trip.dto.TripUpdateRequest;
import com.tripplannerz.domain.trip.service.TripService;
import com.tripplannerz.global.common.ApiResponse;
import com.tripplannerz.global.common.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TripResponse> create(
            @AuthenticationPrincipal Long memberId, @Valid @RequestBody TripCreateRequest request) {
        return ApiResponse.onSuccess(tripService.create(memberId, request));
    }

    @GetMapping("/{id}")
    public ApiResponse<TripResponse> get(
            @AuthenticationPrincipal Long memberId, @PathVariable Long id) {
        return ApiResponse.onSuccess(tripService.getReadable(id, memberId));
    }

    @GetMapping
    public ApiResponse<PageResponse<TripSummaryResponse>> getMine(
            @AuthenticationPrincipal Long memberId, Pageable pageable) {
        return ApiResponse.onSuccess(tripService.getMine(memberId, pageable));
    }

    @PutMapping("/{id}")
    public ApiResponse<TripResponse> update(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long id,
            @Valid @RequestBody TripUpdateRequest request) {
        return ApiResponse.onSuccess(tripService.update(id, memberId, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal Long memberId, @PathVariable Long id) {
        tripService.delete(id, memberId);
        return ApiResponse.onSuccessEmpty();
    }
}
