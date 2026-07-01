plugins {
    java
    id("org.springframework.boot") version "3.5.3"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.tripplannerz"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

extra["queryDslVersion"] = "5.0.0"
extra["mapstructVersion"] = "1.6.3"
extra["springDocVersion"] = "2.8.6"

dependencies {
    // --- Spring core ---
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // 외부 API 호출 전용 (WebClient) — 앱 전반은 MVC로 통일
    implementation("org.springframework.boot:spring-boot-starter-webflux")

    // --- Auth ---
    implementation("com.auth0:java-jwt:4.5.0")

    // --- Persistence: QueryDSL + Flyway ---
    implementation("com.querydsl:querydsl-jpa:${property("queryDslVersion")}:jakarta")
    annotationProcessor("com.querydsl:querydsl-apt:${property("queryDslVersion")}:jakarta")
    annotationProcessor("jakarta.annotation:jakarta.annotation-api")
    annotationProcessor("jakarta.persistence:jakarta.persistence-api")

    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    runtimeOnly("org.postgresql:postgresql")

    // --- Mapping ---
    implementation("org.mapstruct:mapstruct:${property("mapstructVersion")}")
    annotationProcessor("org.mapstruct:mapstruct-processor:${property("mapstructVersion")}")
    annotationProcessor("org.projectlombok:lombok-mapstruct-binding:0.2.0")

    // --- Lombok ---
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // --- API docs ---
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:${property("springDocVersion")}")

    // --- Test ---
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

// QueryDSL Q타입 생성 위치 (산출물 — 커밋/수정 금지)
val generatedDir = "src/main/generated"

tasks.withType<JavaCompile> {
    options.generatedSourceOutputDirectory.set(file(generatedDir))
}

sourceSets {
    main {
        java {
            srcDir(generatedDir)
        }
    }
}

tasks.named<Delete>("clean") {
    delete(file(generatedDir))
}

tasks.withType<Test> {
    useJUnitPlatform()
}
