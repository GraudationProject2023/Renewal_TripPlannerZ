package com.tripplannerz.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** springdoc OpenAPI 문서 메타. Swagger UI: /swagger-ui, 스펙: /v3/api-docs */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI tripPlannerzOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("TripPlannerZ API")
                        .description("여행 일정 관리 · 예산 설계 · 동행자 매칭 플랫폼 API")
                        .version("v1"));
    }
}
