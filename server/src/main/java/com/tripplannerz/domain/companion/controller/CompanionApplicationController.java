package com.tripplannerz.domain.companion.controller;

import com.tripplannerz.domain.companion.dto.ApplicationCreateRequest;
import com.tripplannerz.domain.companion.dto.ApplicationResponse;
import com.tripplannerz.domain.companion.service.CompanionApplicationService;
import com.tripplannerz.global.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/companions/{companionId}/applications")
@RequiredArgsConstructor
public class CompanionApplicationController {

    private final CompanionApplicationService applicationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ApplicationResponse> apply(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long companionId,
            @Valid @RequestBody ApplicationCreateRequest request) {
        return ApiResponse.onSuccess(applicationService.apply(companionId, memberId, request));
    }

    @GetMapping
    public ApiResponse<List<ApplicationResponse>> list(
            @AuthenticationPrincipal Long memberId, @PathVariable Long companionId) {
        return ApiResponse.onSuccess(applicationService.list(companionId, memberId));
    }

    @PatchMapping("/{applicationId}/accept")
    public ApiResponse<ApplicationResponse> accept(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long companionId,
            @PathVariable Long applicationId) {
        return ApiResponse.onSuccess(applicationService.accept(companionId, applicationId, memberId));
    }

    @PatchMapping("/{applicationId}/reject")
    public ApiResponse<ApplicationResponse> reject(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long companionId,
            @PathVariable Long applicationId) {
        return ApiResponse.onSuccess(applicationService.reject(companionId, applicationId, memberId));
    }
}
