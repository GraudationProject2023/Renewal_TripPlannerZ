package com.tripplannerz.domain.companion.controller;

import com.tripplannerz.domain.companion.dto.CompanionCreateRequest;
import com.tripplannerz.domain.companion.dto.CompanionResponse;
import com.tripplannerz.domain.companion.dto.CompanionSummaryResponse;
import com.tripplannerz.domain.companion.dto.CompanionUpdateRequest;
import com.tripplannerz.domain.companion.service.CompanionService;
import com.tripplannerz.global.common.ApiResponse;
import com.tripplannerz.global.common.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/companions")
@RequiredArgsConstructor
public class CompanionController {

    private final CompanionService companionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CompanionResponse> create(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody CompanionCreateRequest request) {
        return ApiResponse.success(companionService.create(memberId, request));
    }

    @GetMapping
    public ApiResponse<PageResponse<CompanionSummaryResponse>> getRecruiting(Pageable pageable) {
        return ApiResponse.success(companionService.getRecruiting(pageable));
    }

    @GetMapping("/mine")
    public ApiResponse<PageResponse<CompanionSummaryResponse>> getMine(
            @AuthenticationPrincipal Long memberId, Pageable pageable) {
        return ApiResponse.success(companionService.getMine(memberId, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<CompanionResponse> get(@PathVariable Long id) {
        return ApiResponse.success(companionService.getById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<CompanionResponse> update(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long id,
            @Valid @RequestBody CompanionUpdateRequest request) {
        return ApiResponse.success(companionService.update(id, memberId, request));
    }

    @PatchMapping("/{id}/close")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> close(
            @AuthenticationPrincipal Long memberId, @PathVariable Long id) {
        companionService.close(id, memberId);
        return ApiResponse.success();
    }
}
