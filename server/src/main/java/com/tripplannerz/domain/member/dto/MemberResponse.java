package com.tripplannerz.domain.member.dto;

import com.tripplannerz.domain.member.entity.Role;

/** 회원 응답 DTO. 비밀번호 등 민감 정보는 절대 포함하지 않는다. */
public record MemberResponse(
        Long id,
        String email,
        String nickname,
        Role role) {
}
