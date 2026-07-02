package com.tripplannerz.domain.chat.service;

import com.tripplannerz.domain.chat.dto.ChatMessageResponse;
import com.tripplannerz.domain.chat.dto.ChatRoomResponse;
import com.tripplannerz.domain.chat.entity.ChatMessage;
import com.tripplannerz.domain.chat.entity.ChatRoom;
import com.tripplannerz.domain.chat.entity.ChatRoomMember;
import com.tripplannerz.domain.chat.repository.ChatMessageRepository;
import com.tripplannerz.domain.chat.repository.ChatRoomMemberRepository;
import com.tripplannerz.domain.chat.repository.ChatRoomRepository;
import com.tripplannerz.global.common.PageResponse;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private static final String TOPIC_PREFIX = "/topic/chat.rooms.";

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /** 동행 생성 시 방 생성 + 호스트 참여(멱등). */
    @Transactional
    public void createRoom(Long companionId, Long hostId) {
        if (chatRoomRepository.existsByCompanionId(companionId)) {
            return;
        }
        ChatRoom room = chatRoomRepository.save(ChatRoom.builder().companionId(companionId).build());
        chatRoomMemberRepository.save(
                ChatRoomMember.builder().roomId(room.getId()).memberId(hostId).build());
    }

    /** 동행 지원 수락 시 지원자를 방에 참여시킨다(멱등). */
    @Transactional
    public void addMemberByCompanion(Long companionId, Long memberId) {
        ChatRoom room = chatRoomRepository.findByCompanionId(companionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHAT_ROOM_NOT_FOUND));
        if (!chatRoomMemberRepository.existsByRoomIdAndMemberId(room.getId(), memberId)) {
            chatRoomMemberRepository.save(
                    ChatRoomMember.builder().roomId(room.getId()).memberId(memberId).build());
        }
    }

    public List<ChatRoomResponse> getMyRooms(Long memberId) {
        return chatRoomMemberRepository.findAllByMemberId(memberId).stream()
                .map(member -> chatRoomRepository.findById(member.getRoomId()).orElse(null))
                .filter(Objects::nonNull)
                .map(room -> new ChatRoomResponse(room.getId(), room.getCompanionId()))
                .toList();
    }

    public PageResponse<ChatMessageResponse> getMessages(Long roomId, Long memberId, Pageable pageable) {
        requireMember(roomId, memberId);
        return PageResponse.from(
                chatMessageRepository.findAllByRoomIdOrderByIdDesc(roomId, pageable).map(this::toResponse));
    }

    /** 메시지 저장 후 /topic 으로 브로드캐스트한다. */
    @Transactional
    public ChatMessageResponse sendMessage(Long roomId, Long senderId, String content) {
        requireMember(roomId, senderId);
        ChatMessage saved = chatMessageRepository.save(
                ChatMessage.builder().roomId(roomId).senderId(senderId).content(content).build());
        ChatMessageResponse response = toResponse(saved);
        messagingTemplate.convertAndSend(TOPIC_PREFIX + roomId, response);
        return response;
    }

    private void requireMember(Long roomId, Long memberId) {
        if (!chatRoomRepository.existsById(roomId)) {
            throw new BusinessException(ErrorCode.CHAT_ROOM_NOT_FOUND);
        }
        if (!chatRoomMemberRepository.existsByRoomIdAndMemberId(roomId, memberId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getRoomId(),
                message.getSenderId(),
                message.getContent(),
                message.getCreatedAt());
    }
}
