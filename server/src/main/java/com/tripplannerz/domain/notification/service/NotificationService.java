package com.tripplannerz.domain.notification.service;

import com.tripplannerz.domain.notification.dto.NotificationResponse;
import com.tripplannerz.domain.notification.entity.Notification;
import com.tripplannerz.domain.notification.entity.NotificationType;
import com.tripplannerz.domain.notification.repository.NotificationRepository;
import com.tripplannerz.global.common.PageResponse;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /** 다른 도메인에서 이벤트 발생 시 호출하는 알림 생성 진입점. */
    @Transactional
    public void create(Long recipientId, NotificationType type, String message, Long relatedId) {
        notificationRepository.save(Notification.builder()
                .recipientId(recipientId)
                .type(type)
                .message(message)
                .relatedId(relatedId)
                .build());
    }

    public PageResponse<NotificationResponse> getMine(Long recipientId, Pageable pageable) {
        return PageResponse.from(
                notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(recipientId, pageable)
                        .map(this::toResponse));
    }

    public long unreadCount(Long recipientId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(recipientId);
    }

    @Transactional
    public void markRead(Long id, Long recipientId) {
        Notification notification = notificationRepository.findByIdAndRecipientId(id, recipientId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.markAsRead();
    }

    @Transactional
    public void markAllRead(Long recipientId) {
        notificationRepository.markAllRead(recipientId);
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getMessage(),
                notification.getRelatedId(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}
