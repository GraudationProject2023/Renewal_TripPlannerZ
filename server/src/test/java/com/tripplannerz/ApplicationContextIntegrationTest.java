package com.tripplannerz;

import com.tripplannerz.support.IntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * 전체 컨텍스트 로딩을 검증한다. 이 테스트가 통과하면
 * Flyway 마이그레이션(V1~V8)이 모두 적용되고 Hibernate ddl-auto=validate가
 * 엔티티 매핑과 스키마 정합성을 확인한 것이다.
 */
class ApplicationContextIntegrationTest extends IntegrationTest {

    @Test
    @DisplayName("컨텍스트 로딩 + 마이그레이션 + 스키마 validate 통과")
    void contextLoads() {
        // 컨텍스트가 뜨면 성공 (Flyway 적용 + Hibernate validate 포함)
    }
}
