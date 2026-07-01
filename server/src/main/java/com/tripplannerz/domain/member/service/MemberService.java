package com.tripplannerz.domain.member.service;

import com.tripplannerz.domain.member.dto.MemberResponse;
import com.tripplannerz.domain.member.dto.SignUpRequest;
import com.tripplannerz.domain.member.entity.Member;
import com.tripplannerz.domain.member.mapper.MemberMapper;
import com.tripplannerz.domain.member.repository.MemberRepository;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
        Member member = Member.ofLocal(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.nickname());
        return memberMapper.toResponse(memberRepository.save(member));
    }

    public MemberResponse getById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        return memberMapper.toResponse(member);
    }
}
