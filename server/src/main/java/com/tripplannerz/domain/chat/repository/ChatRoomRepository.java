package com.tripplannerz.domain.chat.repository;

import com.tripplannerz.domain.chat.entity.ChatRoom;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByCompanionId(Long companionId);

    boolean existsByCompanionId(Long companionId);
}
