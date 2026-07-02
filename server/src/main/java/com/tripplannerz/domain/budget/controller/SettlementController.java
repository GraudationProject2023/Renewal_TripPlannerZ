package com.tripplannerz.domain.budget.controller;

import com.tripplannerz.domain.budget.dto.SettlementResponse;
import com.tripplannerz.domain.budget.service.SettlementService;
import com.tripplannerz.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/settlement")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    @GetMapping
    public ApiResponse<SettlementResponse> settle(
            @AuthenticationPrincipal Long memberId, @PathVariable Long tripId) {
        return ApiResponse.onSuccess(settlementService.settle(tripId, memberId));
    }
}
