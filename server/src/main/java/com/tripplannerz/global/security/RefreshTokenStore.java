package com.tripplannerz.global.security;

import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

/**
 * refresh 토큰을 Redis에 저장/회전한다. memberId당 1개만 유효(재발급 시 덮어써 회전).
 * 키: {@code refresh:{memberId}}, TTL = refresh 유효기간.
 */
@Component
@RequiredArgsConstructor
public class RefreshTokenStore {

    private static final String KEY_PREFIX = "refresh:";

    private final StringRedisTemplate redisTemplate;
    private final JwtProperties properties;

    public void save(Long memberId, String refreshToken) {
        redisTemplate.opsForValue()
                .set(key(memberId), refreshToken, Duration.ofSeconds(properties.refreshTokenValiditySeconds()));
    }

    public boolean matches(Long memberId, String refreshToken) {
        String stored = redisTemplate.opsForValue().get(key(memberId));
        return stored != null && stored.equals(refreshToken);
    }

    public void delete(Long memberId) {
        redisTemplate.delete(key(memberId));
    }

    private String key(Long memberId) {
        return KEY_PREFIX + memberId;
    }
}
