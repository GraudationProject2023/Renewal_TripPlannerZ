package com.tripplannerz.domain.notification.controller;

import com.tripplannerz.domain.notification.dto.NotificationResponse;
import com.tripplannerz.domain.notification.dto.UnreadCountResponse;
import com.tripplannerz.domain.notification.service.NotificationService;
import com.tripplannerz.global.common.ApiResponse;
import com.tripplannerz.global.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ApiResponse<PageResponse<NotificationResponse>> getMine(
            @AuthenticationPrincipal Long memberId, Pageable pageable) {
        return ApiResponse.onSuccess(notificationService.getMine(memberId, pageable));
    }

    @GetMapping("/unread-count")
    public ApiResponse<UnreadCountResponse> unreadCount(@AuthenticationPrincipal Long memberId) {
        return ApiResponse.onSuccess(new UnreadCountResponse(notificationService.unreadCount(memberId)));
    }

    @PatchMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> markRead(
            @AuthenticationPrincipal Long memberId, @PathVariable Long id) {
        notificationService.markRead(id, memberId);
        return ApiResponse.onSuccessEmpty();
    }

    @PatchMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> markAllRead(@AuthenticationPrincipal Long memberId) {
        notificationService.markAllRead(memberId);
        return ApiResponse.onSuccessEmpty();
    }
}
