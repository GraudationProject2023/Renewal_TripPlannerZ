package com.tripplannerz.domain.chat.controller;

import com.tripplannerz.domain.chat.dto.ChatMessageResponse;
import com.tripplannerz.domain.chat.dto.ChatMessageSendRequest;
import com.tripplannerz.domain.chat.dto.ChatRoomResponse;
import com.tripplannerz.domain.chat.service.ChatService;
import com.tripplannerz.global.common.ApiResponse;
import com.tripplannerz.global.common.PageResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/rooms")
    public ApiResponse<List<ChatRoomResponse>> myRooms(@AuthenticationPrincipal Long memberId) {
        return ApiResponse.onSuccess(chatService.getMyRooms(memberId));
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ApiResponse<PageResponse<ChatMessageResponse>> messages(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long roomId,
            Pageable pageable) {
        return ApiResponse.onSuccess(chatService.getMessages(roomId, memberId, pageable));
    }

    @PostMapping("/rooms/{roomId}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ChatMessageResponse> send(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long roomId,
            @Valid @RequestBody ChatMessageSendRequest request) {
        return ApiResponse.onSuccess(chatService.sendMessage(roomId, memberId, request.content()));
    }
}
