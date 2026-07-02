package com.tripplannerz.domain.budget.controller;

import com.tripplannerz.domain.budget.dto.BudgetSummaryResponse;
import com.tripplannerz.domain.budget.service.ExpenseService;
import com.tripplannerz.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final ExpenseService expenseService;

    @GetMapping
    public ApiResponse<BudgetSummaryResponse> summary(
            @AuthenticationPrincipal Long memberId, @PathVariable Long tripId) {
        return ApiResponse.success(expenseService.summary(tripId, memberId));
    }
}
