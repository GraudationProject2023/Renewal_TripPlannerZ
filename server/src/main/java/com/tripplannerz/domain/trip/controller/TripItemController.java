package com.tripplannerz.domain.trip.controller;

import com.tripplannerz.domain.trip.dto.TripItemCreateRequest;
import com.tripplannerz.domain.trip.dto.TripItemReorderRequest;
import com.tripplannerz.domain.trip.dto.TripItemResponse;
import com.tripplannerz.domain.trip.service.TripItemService;
import com.tripplannerz.global.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/v1/trips/{tripId}/items")
@RequiredArgsConstructor
public class TripItemController {

    private final TripItemService tripItemService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TripItemResponse> add(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long tripId,
            @Valid @RequestBody TripItemCreateRequest request) {
        return ApiResponse.onSuccess(tripItemService.add(tripId, memberId, request));
    }

    @GetMapping
    public ApiResponse<List<TripItemResponse>> list(
            @AuthenticationPrincipal Long memberId, @PathVariable Long tripId) {
        return ApiResponse.onSuccess(tripItemService.list(tripId, memberId));
    }

    @PutMapping("/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> reorder(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long tripId,
            @Valid @RequestBody TripItemReorderRequest request) {
        tripItemService.reorder(tripId, memberId, request);
        return ApiResponse.onSuccessEmpty();
    }

    @DeleteMapping("/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long tripId,
            @PathVariable Long itemId) {
        tripItemService.delete(tripId, itemId, memberId);
        return ApiResponse.onSuccessEmpty();
    }
}
