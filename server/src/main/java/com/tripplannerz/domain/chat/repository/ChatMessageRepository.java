package com.tripplannerz.domain.chat.repository;

import com.tripplannerz.domain.chat.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findAllByRoomIdOrderByIdDesc(Long roomId, Pageable pageable);
}
