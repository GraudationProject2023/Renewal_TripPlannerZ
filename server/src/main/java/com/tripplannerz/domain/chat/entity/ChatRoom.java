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

/** 동행 1건당 채팅방 1개(companion_id 유일). 참여자는 ChatRoomMember로 관리한다. */
@Getter
@Entity
@Table(name = "chat_room")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "companion_id", nullable = false, unique = true)
    private Long companionId;

    @Builder
    private ChatRoom(Long companionId) {
        this.companionId = companionId;
    }
}
