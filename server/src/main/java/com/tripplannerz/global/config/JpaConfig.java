package com.tripplannerz.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/** {@code @CreatedDate}/{@code @LastModifiedDate} 자동 채움 활성화. */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
