package com.tripplannerz.domain.budget.controller;

import com.tripplannerz.domain.budget.dto.ExpenseCreateRequest;
import com.tripplannerz.domain.budget.dto.ExpenseResponse;
import com.tripplannerz.domain.budget.service.ExpenseService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ExpenseResponse> create(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long tripId,
            @Valid @RequestBody ExpenseCreateRequest request) {
        return ApiResponse.success(expenseService.create(tripId, memberId, request));
    }

    @GetMapping
    public ApiResponse<List<ExpenseResponse>> list(
            @AuthenticationPrincipal Long memberId, @PathVariable Long tripId) {
        return ApiResponse.success(expenseService.list(tripId, memberId));
    }

    @DeleteMapping("/{expenseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long tripId,
            @PathVariable Long expenseId) {
        expenseService.delete(tripId, expenseId, memberId);
        return ApiResponse.success();
    }
}
