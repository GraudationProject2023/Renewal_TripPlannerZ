package com.tripplannerz.domain.chat.repository;

import com.tripplannerz.domain.chat.entity.ChatRoomMember;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {

    boolean existsByRoomIdAndMemberId(Long roomId, Long memberId);

    List<ChatRoomMember> findAllByMemberId(Long memberId);
}
