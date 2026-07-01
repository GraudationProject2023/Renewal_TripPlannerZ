package com.tripplannerz.global.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import java.time.Instant;
import java.util.Date;
import org.springframework.stereotype.Component;

/** HMAC256 기반 access/refresh 토큰 생성·검증. subject = memberId, access에는 role 클레임 포함. */
@Component
public class JwtProvider {

    public static final String CLAIM_ROLE = "role";

    private final JwtProperties properties;
    private final Algorithm algorithm;
    private final JWTVerifier verifier;

    public JwtProvider(JwtProperties properties) {
        this.properties = properties;
        this.algorithm = Algorithm.HMAC256(properties.secret());
        this.verifier = JWT.require(algorithm).withIssuer(properties.issuer()).build();
    }

    public String createAccessToken(Long memberId, String role) {
        Instant now = Instant.now();
        return baseBuilder(memberId, now, properties.accessTokenValiditySeconds())
                .withClaim(CLAIM_ROLE, role)
                .sign(algorithm);
    }

    public String createRefreshToken(Long memberId) {
        Instant now = Instant.now();
        return baseBuilder(memberId, now, properties.refreshTokenValiditySeconds())
                .sign(algorithm);
    }

    /** 서명·만료·issuer 검증. 실패 시 {@link com.auth0.jwt.exceptions.JWTVerificationException}. */
    public DecodedJWT verify(String token) {
        return verifier.verify(token);
    }

    private JWTCreator.Builder baseBuilder(Long memberId, Instant issuedAt, long validitySeconds) {
        return JWT.create()
                .withIssuer(properties.issuer())
                .withSubject(String.valueOf(memberId))
                .withIssuedAt(Date.from(issuedAt))
                .withExpiresAt(Date.from(issuedAt.plusSeconds(validitySeconds)));
    }
}
