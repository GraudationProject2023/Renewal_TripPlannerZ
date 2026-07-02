package com.tripplannerz.domain.notification.entity;

import com.tripplannerz.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 사용자 알림. relatedId는 알림이 가리키는 리소스 식별자(예: companionId). */
@Getter
@Entity
@Table(name = "notification")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private NotificationType type;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    /** 알림이 가리키는 리소스 식별자. 미지정 가능. */
    @Column(name = "related_id")
    private Long relatedId;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;

    @Builder
    private Notification(Long recipientId, NotificationType type, String message, Long relatedId) {
        this.recipientId = recipientId;
        this.type = type;
        this.message = message;
        this.relatedId = relatedId;
        this.isRead = false;
    }

    public void markAsRead() {
        this.isRead = true;
    }
}
