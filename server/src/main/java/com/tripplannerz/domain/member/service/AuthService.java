package com.tripplannerz.domain.member.service;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.tripplannerz.domain.member.dto.LoginRequest;
import com.tripplannerz.domain.member.dto.TokenResponse;
import com.tripplannerz.domain.member.entity.Member;
import com.tripplannerz.domain.member.repository.MemberRepository;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import com.tripplannerz.global.security.JwtProvider;
import com.tripplannerz.global.security.RefreshTokenStore;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenStore refreshTokenStore;

    /** 이메일/비밀번호 검증 후 access/refresh 발급. 존재 여부와 비밀번호 오류를 구분하지 않는다(계정 열거 방지). */
    public TokenResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));
        if (member.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), member.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
        return issue(member);
    }

    /** refresh 토큰 검증 + Redis 저장값 일치 확인 후 회전(새 토큰 발급). */
    public TokenResponse reissue(String refreshToken) {
        Long memberId = parseMemberId(refreshToken);
        if (!refreshTokenStore.matches(memberId, refreshToken)) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        return issue(member);
    }

    public void logout(Long memberId) {
        refreshTokenStore.delete(memberId);
    }

    private TokenResponse issue(Member member) {
        String accessToken = jwtProvider.createAccessToken(member.getId(), member.getRole().name());
        String refreshToken = jwtProvider.createRefreshToken(member.getId());
        refreshTokenStore.save(member.getId(), refreshToken);
        return new TokenResponse(accessToken, refreshToken);
    }

    private Long parseMemberId(String refreshToken) {
        try {
            return Long.valueOf(jwtProvider.verify(refreshToken).getSubject());
        } catch (JWTVerificationException | NumberFormatException e) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }
    }
}
