package com.tripplannerz.domain.member.entity;

/** 인증 제공자. LOCAL은 이메일/비밀번호 가입, 그 외는 소셜 로그인(OAuth2). */
public enum AuthProvider {
    LOCAL,
    GOOGLE,
    KAKAO,
    NAVER,
}
