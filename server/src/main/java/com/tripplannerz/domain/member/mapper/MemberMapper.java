package com.tripplannerz.domain.member.mapper;

import com.tripplannerz.domain.member.dto.MemberResponse;
import com.tripplannerz.domain.member.entity.Member;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    MemberResponse toResponse(Member member);
}
