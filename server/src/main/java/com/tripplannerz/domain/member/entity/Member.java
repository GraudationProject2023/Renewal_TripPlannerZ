package com.tripplannerz.domain.member.entity;

import com.tripplannerz.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    /** OAuth 전용 계정은 비밀번호가 없을 수 있어 nullable. 항상 해시로만 저장한다. */
    @Column(name = "password_hash")
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuthProvider provider;

    /** 소셜 로그인 제공자의 사용자 식별자. 로컬 가입은 null. */
    @Column(name = "provider_id")
    private String providerId;

    @Builder
    private Member(
            String email,
            String passwordHash,
            String nickname,
            Role role,
            AuthProvider provider,
            String providerId) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.nickname = nickname;
        this.role = role;
        this.provider = provider;
        this.providerId = providerId;
    }

    /** 이메일/비밀번호 기반 로컬 회원 생성. 비밀번호는 반드시 해시된 값을 넘긴다. */
    public static Member ofLocal(String email, String passwordHash, String nickname) {
        return Member.builder()
                .email(email)
                .passwordHash(passwordHash)
                .nickname(nickname)
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .build();
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }
}
