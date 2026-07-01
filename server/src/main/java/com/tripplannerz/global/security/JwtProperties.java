package com.tripplannerz.global.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** JWT 설정. 값은 프로파일 설정(application*.yml)의 {@code jwt.*}에서 주입. 시크릿은 환경변수로. */
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        String secret,
        String issuer,
        long accessTokenValiditySeconds,
        long refreshTokenValiditySeconds) {
}
