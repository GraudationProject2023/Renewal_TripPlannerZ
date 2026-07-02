package com.tripplannerz.domain.chat.entity;

import com.tripplannerz.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 채팅방 참여자. (room_id, member_id)는 유일. 접근 제어의 기준이 된다. */
@Getter
@Entity
@Table(
        name = "chat_room_member",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uq_chat_room_member",
                        columnNames = {"room_id", "member_id"}))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoomMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Builder
    private ChatRoomMember(Long roomId, Long memberId) {
        this.roomId = roomId;
        this.memberId = memberId;
    }
}
