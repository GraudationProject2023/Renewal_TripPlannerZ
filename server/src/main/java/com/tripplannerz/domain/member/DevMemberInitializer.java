package com.tripplannerz.domain.member;

import com.tripplannerz.domain.member.entity.AuthProvider;
import com.tripplannerz.domain.member.entity.Member;
import com.tripplannerz.domain.member.entity.Role;
import com.tripplannerz.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 로컬 개발용 시드 계정 생성기. {@code local} 프로파일에서만 동작하며 멱등하다.
 * 로그인 플로우 확인용 — 운영에는 절대 포함되지 않는다.
 */
@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class DevMemberInitializer implements ApplicationRunner {

    private static final String DEFAULT_PASSWORD = "password123";

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seed("test@tripplannerz.com", "테스터", Role.USER);
        seed("admin@tripplannerz.com", "관리자", Role.ADMIN);
    }

    private void seed(String email, String nickname, Role role) {
        if (memberRepository.existsByEmail(email)) {
            return;
        }
        memberRepository.save(Member.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(DEFAULT_PASSWORD))
                .nickname(nickname)
                .role(role)
                .provider(AuthProvider.LOCAL)
                .build());
        log.info("[dev seed] created {} account: {} / {}", role, email, DEFAULT_PASSWORD);
    }
}
