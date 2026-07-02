package com.tripplannerz.domain.chat.entity;

import com.tripplannerz.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 채팅 메시지. createdAt(BaseEntity)이 전송 시각. */
@Getter
@Entity
@Table(name = "chat_message")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Builder
    private ChatMessage(Long roomId, Long senderId, String content) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.content = content;
    }
}
