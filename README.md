# ✈️ TripPlannerZ

### 여행 일정 관리 · 예산 설계 · 동행자 매칭 플랫폼

> 혼자 떠나는 여행을 **더 싸고, 더 안전하고, 덜 외롭게.**
> 일정 짜기부터 동행 구하기, 정산까지 하나의 흐름으로 잇는 여행 SaaS.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white">
  <img alt="Turborepo" src="https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo&logoColor=white">
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white">
  <br>
  <img alt="Java" src="https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white">
  <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?logo=springboot&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white">
  <img alt="Redis" src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white">
  <img alt="Flyway" src="https://img.shields.io/badge/Flyway-migrations-CC0200?logo=flyway&logoColor=white">
  <img alt="CircleCI" src="https://img.shields.io/badge/CircleCI-343434?logo=circleci&logoColor=white">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-black">
</p>

---

> **📌 이 문서에 대하여**
> 2023년 졸업작품(CRA·JS 프론트, Spring Boot 3.0.5·Java 17 백엔드)을 2026년 현재
> **모노레포 · TypeScript · Java 21 / Spring Boot 3.5**로 전면 재설계하는 리라이트 기록입니다.
> 신규 구현은 프론트 모노레포(`/apps`, `/packages`)와 재작성 백엔드(`/server`)에 있으며,
> 재구성 과정에서 신경 쓴 엔지니어링 결정은 [재구성 엔지니어링 노트](#9-재구성-엔지니어링-노트-포트폴리오)에 정리했습니다.

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [문제 정의와 해결 가설](#2-문제-정의와-해결-가설)
3. [핵심 기능](#3-핵심-기능)
4. [기술 스택](#4-기술-스택)
5. [시스템 아키텍처](#5-시스템-아키텍처)
6. [프론트엔드 아키텍처 (FSD)](#6-프론트엔드-아키텍처-fsd)
7. [백엔드 아키텍처 (Package-by-Feature)](#7-백엔드-아키텍처-package-by-feature)
8. [API 요약](#8-api-요약)
9. [재구성 엔지니어링 노트 (포트폴리오)](#9-재구성-엔지니어링-노트-포트폴리오)
10. [프로젝트 구조](#10-프로젝트-구조)
11. [시작하기](#11-시작하기)
12. [품질 · 테스트 · CI/CD](#12-품질--테스트--cicd)
13. [재구성 로드맵 (Legacy → Rewrite)](#13-재구성-로드맵-legacy--rewrite)
14. [비즈니스 모델 & 지표](#14-비즈니스-모델--지표)
15. [팀 & 기간](#15-팀--기간)

---

## 1. 프로젝트 개요

코로나19 이후 여가·관광 수요가 빠르게 회복되면서, 특히 **나 홀로 여행(솔로 트래블)** 시장이
구조적으로 성장했습니다. 자유도는 높지만 (1) 1인 부담 비용이 크고, (2) 안전·심리적 진입장벽이 있으며,
(3) 여행 계획을 세우는 과정 자체가 번거롭다는 페인 포인트가 뚜렷합니다.

**TripPlannerZ**는 이 세 가지를 하나의 제품 안에서 해결합니다.

- 🗺️ **일정 설계** — 목적지·기간·예산을 입력해 일정을 구성하고, 드래그 앤 드롭으로 다듬습니다.
- 💸 **예산 관리 · 정산** — 항목별 지출을 기록하고 동행자와 N빵 정산합니다.
- 🤝 **동행 매칭** — 모집·지원·수락으로 함께 갈 사람을 찾습니다.
- 🧭 **경로 최적화** — 하루 동선을 최단 경로로 재배치해 이동 낭비를 줄입니다.

2023년 졸업작품 MVP에서 검증한 핵심 흐름(일정→동행→정산)을 유지하면서,
확장 가능한 아키텍처와 운영 체계를 갖춘 **상용 서비스**로 다시 만듭니다.

## 2. 문제 정의와 해결 가설

| 사용자 페인 포인트              | 기존 대안의 한계                             | TripPlannerZ의 접근                     |
| ------------------------------- | -------------------------------------------- | --------------------------------------- |
| 1인 여행 비용 부담              | 카페/오픈채팅 동행 모집은 신뢰·정산이 어려움 | 프로필·리뷰 기반 매칭 + 자동 정산       |
| 일정 짜기가 번거로움            | 지도·블로그·메모장을 오가며 수작업           | 초안 구성 + DnD 편집 + 경로 최적화      |
| 안전·신뢰 우려                  | 상대에 대한 정보 부족                        | 본인 인증, 매너 평점, 신고/차단         |
| 언어 장벽 (인바운드/아웃바운드) | 국문 전용 서비스                             | i18n 다국어(ko/en) 기본 내장            |

> **핵심 가설**: "일정 → 동행 → 정산"을 끊김 없이 한 흐름으로 제공하면,
> 동행 매칭의 전환율과 재방문율이 유의미하게 올라간다.

## 3. 핵심 기능

| 도메인 | 기능 | 상태 |
| --- | --- | --- |
| **여행 일정** | 일정 CRUD · 공개/비공개 · 일자별 장소(메모/비용/체류시간) · DnD 재정렬 | ✅ API |
| **경로 최적화** | 하루 동선 최단 경로(하버사인 + 최근접이웃) 미리보기/저장 | ✅ API |
| **동행 매칭** | 모집글 CRUD · 지원/수락/거절 · 정원 관리 · 자동 마감 | ✅ API |
| **예산 · 정산** | 지출 기록(N빵 분할) · 예산 요약 · 정산(잔액 + 최소 송금) | ✅ API |
| **알림** | 지원/수락/거절 이벤트 알림 · 미읽음 수 · 읽음 처리 | ✅ API |
| **채팅** | 동행별 채팅방 · 이력 · 실시간(STOMP 브로드캐스트) | ✅ API |
| **계정 · 인증** | 회원가입 · JWT 로그인/재발급(회전)/로그아웃 · OAuth2(예정) | ✅ API |
| **국제화** | i18next 다국어(ko/en), 키 스캔/동기화 | ✅ FE |

> 위 표의 상태는 **백엔드 API 기준**입니다. 프론트(FSD) 연동 현황은 [로드맵](#13-재구성-로드맵-legacy--rewrite) 참고.

## 4. 기술 스택

### 프론트엔드

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5.9** · **Turborepo** + pnpm 모노레포 · **Tailwind CSS 4**
- 서버 상태 **TanStack Query** / 클라 상태 **Zustand** / 폼·검증 **React Hook Form + Zod** / HTTP **Axios**
- UX: **react-dnd**(타임라인 DnD) · **react-markdown + DOMPurify** · **next-themes** · **date-fns**
- 품질: **Storybook 8 + Chromatic** · **Jest + Testing Library** · **Playwright** · **MSW** · ESLint(flat)/Prettier/Husky/commitlint/Changesets

### 백엔드

- **Java 21 (LTS)** · **Spring Boot 3.5** · **Gradle (Kotlin DSL)**
- **Spring Web (MVC)** · **Spring Data JPA** · **QueryDSL 5**
- **PostgreSQL 16** · **Redis 7**(JWT refresh 저장/회전) · **Flyway**(스키마) · `ddl-auto: validate`
- **Spring Security 6** + **JWT**(java-jwt) · **WebSocket/STOMP**(채팅) · **Spring Mail**
- **springdoc-openapi**(Swagger) · **MapStruct** · **Lombok** · **Actuator/Micrometer**
- 테스트: **JUnit 5** · **Testcontainers**(Postgres/Redis) · MockMvc · AssertJ

## 5. 시스템 아키텍처

```
┌──────────────┐    ┌─────────────────────┐    ┌────────────────────────┐
│   Browser    │──▶ │  apps/web (Next.js)  │──▶ │  server (Spring Boot)  │
│ (Web/Mobile) │    │  페이지 서빙 · BFF    │    │  REST /api/v1 · STOMP  │
└──────────────┘    └──────────┬──────────┘    └───────────┬────────────┘
      ▲ STOMP /ws                │  render                   │
      └──────────────────────────┼───────────────────────────┤
                    ┌────────────┴────────┐     ┌─────────────┴────────┐
                    │  packages/ui (@ui)  │     │  PostgreSQL 16       │
                    │  FSD (pages…shared) │     │  Redis 7 (토큰/캐시)  │
                    └─────────────────────┘     └──────────────────────┘
```

- **프론트**: `apps/web`(Next.js)는 라우팅·서빙만, 실제 화면·로직은 `packages/ui`(FSD)가 소유.
- **백엔드**: `server`(Spring Boot)가 `/api/v1` REST + `/ws` STOMP 제공. 스키마는 **Flyway 전용** 관리.
- **로컬 인프라**: `docker-compose.yml`로 **PostgreSQL + Redis**만 컨테이너. 앱은 로컬 실행.
- **CI**: **CircleCI** — 프론트(pnpm) / 백엔드(Gradle) 잡 분리. (레거시 Travis·DockerHub·AWS EB 파이프라인 제거)
- **배포**: 프론트 **Vercel**, 백엔드 배포 방식은 확정 예정.

## 6. 프론트엔드 아키텍처 (FSD)

**Feature-Sliced Design** — 레이어 의존은 상위 → 하위 단방향, 역방향 import 금지.

```
app → processes → pages → widgets → features → entities → shared
```

- `apps/web`의 각 `page.tsx`는 `@ui`의 **pages 레이어**를 import 해서 렌더링만 한다.
- 현재 `packages/ui/shared` 레이어 구축 완료: `ui`(디자인 시스템) · `api`(계약 타입) · `lib`(auth·포맷·마크다운·파일·i18n) · `config`(app·이미지프록시·약관·env).

## 7. 백엔드 아키텍처 (Package-by-Feature)

기술 계층이 아니라 **도메인(기능) 우선**으로 패키지를 나눕니다. 도메인 내부에서만 계층을 둡니다.

```
com.tripplannerz
├─ global/                 # 횡단 관심사 (도메인 무관)
│  ├─ config/              # Security · Jpa(Auditing) · OpenAPI · Cors · WebSocket(STOMP)
│  ├─ common/              # ApiResponse · PageResponse · BaseEntity
│  ├─ error/               # ErrorCode(enum) · BusinessException · GlobalExceptionHandler
│  └─ security/            # JwtProvider · JwtAuthenticationFilter · RefreshTokenStore(Redis)
└─ domain/
   ├─ member/              # 회원/인증(JWT)     — controller·service·repository·entity·dto·mapper
   ├─ trip/                # 여행 일정 · 장소 · 경로 최적화(lib: RouteOptimizer)
   ├─ companion/           # 동행 모집/지원/매칭
   ├─ budget/              # 지출 · 예산 요약 · 정산
   ├─ notification/        # 알림
   └─ chat/                # 실시간 채팅(STOMP)
```

- **표준 응답 래퍼**: 모든 API는 `{ success, data, error }`. 에러 코드는 `ErrorCode` enum으로 중앙 관리하며 **프론트와 문자열 계약**.
- **도메인 경계**: 도메인 간 참조는 **service 계층으로만**. 다른 도메인의 repository/entity 직접 접근 금지. 연관은 **엔티티 참조 대신 식별자(id)** 보관.
- **영속성**: 엔티티는 `BaseEntity`(감사 필드, UTC `Instant`) 상속, LAZY 기본, **Flyway**로 스키마 관리(`ddl-auto: validate`).

## 8. API 요약

모든 응답은 `{ success, data, error }` 래퍼로 감싸며, 인증 필요 엔드포인트는 `Authorization: Bearer <accessToken>`.

| 도메인 | 대표 엔드포인트 |
| --- | --- |
| 인증/회원 | `POST /api/v1/members`(가입) · `POST /api/v1/auth/login\|reissue\|logout` · `GET /api/v1/members/me` |
| 여행 일정 | `POST\|GET\|PUT\|DELETE /api/v1/trips[/{id}]` · `GET /api/v1/trips`(내 목록, 페이징) |
| 일정 장소 | `POST\|GET /api/v1/trips/{id}/items` · `PUT .../items/reorder`(DnD) · `DELETE .../items/{itemId}` |
| 경로 최적화 | `GET /api/v1/trips/{id}/route?day=N`(미리보기) · `POST .../route/optimize?day=N`(저장) |
| 동행 | `POST\|GET /api/v1/companions` · `GET /mine` · `PUT\|GET /{id}` · `PATCH /{id}/close` |
| 동행 지원 | `POST\|GET /api/v1/companions/{id}/applications` · `PATCH .../{appId}/accept\|reject` |
| 예산/정산 | `POST\|GET /api/v1/trips/{id}/expenses` · `GET .../budget`(요약) · `GET .../settlement`(정산) |
| 알림 | `GET /api/v1/notifications` · `GET /unread-count` · `PATCH /{id}/read` · `PATCH /read-all` |
| 채팅 | `GET /api/v1/chat/rooms` · `GET\|POST /rooms/{roomId}/messages` · WS `/ws` → `/topic/chat.rooms.{roomId}` |

> 전체 스펙은 서버 기동 후 **Swagger UI**(`/swagger-ui`)에서 확인.

## 9. 재구성 엔지니어링 노트 (포트폴리오)

> 레거시(단일 패키지 · `ddl-auto: create` · 평문 시크릿 · 테스트 부재)를 실서비스 기준으로
> 다시 세우며 **도메인 단위 수직 슬라이스**로 이관했습니다. 각 슬라이스는 커밋마다 컴파일/테스트를 통과시켰고,
> 아래는 그 과정에서 특히 신경 쓴 결정과 해결한 함정들입니다.

### 9.1 스키마 마이그레이션 전략 (Flyway + validate)

- 레거시의 `ddl-auto: create`(앱이 스키마를 매번 새로 그림)를 폐기하고, **Flyway 단일 소스 + `ddl-auto: validate`** 로 전환.
- 도메인을 추가할 때마다 **엔티티 매핑과 마이그레이션 DDL을 1:1로 정렬**했고, `validate`가 불일치를 기동 시점에 잡아내는 **안전망**으로 동작.
- 마이그레이션은 도메인 추가 순서대로 누적:

  | 버전 | 내용 | | 버전 | 내용 |
  | --- | --- | --- | --- | --- |
  | `V1` | baseline | | `V8` | expense_share |
  | `V2` | member | | `V9` | trip_item **좌표 추가(alter)** |
  | `V3` | trip | | `V10` | notification |
  | `V4` | trip_item | | `V11` | chat_room |
  | `V5` | companion | | `V12` | chat_room_member |
  | `V6` | companion_application | | `V13` | chat_message |
  | `V7` | expense | | | |

- 컬럼명은 Spring **물리 네이밍(camelCase → snake_case)** 에 맞춰 작성, 시간은 **UTC `timestamptz`**, 삭제 전파는 `on delete cascade`/`set null`로 명시.

### 9.2 도메인 경계 설계

- **Package-by-Feature** + 도메인 내부만 계층화(`controller/service/repository/entity/dto/mapper`).
- 도메인 간 결합을 끊기 위해 **엔티티 대신 식별자만 보관**(`Trip.ownerId`, `Companion.hostId`, `Expense.payerId` …). FK는 DB에만 둠.
- 크로스 도메인은 **service 경유만** 허용: 예) `budget`은 `trip.budget`/소유권을 `TripService`로만 조회, `companion` 수락 시 `NotificationService`·`ChatService`를 호출.

### 9.3 인증 · 보안

- **Stateless JWT**: access + refresh, **refresh는 Redis에 저장/회전**(로그인·재발급마다 교체)하여 탈취 내성 확보.
- Spring Security 6 `SecurityFilterChain`에 커스텀 `JwtAuthenticationFilter` 삽입, principal=`memberId`로 `@AuthenticationPrincipal` 주입.
- 미인증 응답을 302/403 대신 **401로 통일**(`HttpStatusEntryPoint`), 리소스 소유자 검증(본인 일정/모집글만 수정).
- **시크릿 제로 하드코딩**: 레거시 프로퍼티에 평문 커밋돼 있던 DB/메일 크리덴셜을 폐기하고 전부 `${ENV}` 주입으로 전환.

### 9.4 도메인 로직에서 공들인 부분

- **N빵 정산의 정확성**: `amount / n` + 나머지를 앞 참여자부터 1원씩 배분해 **분담 합계가 원금과 정확히 일치**. 정산은 멤버별 `지불−분담` 잔액에서 **채무/채권 그리디 매칭으로 최소 송금**을 산출(합이 0이라 완전 정산 보장).
- **경로 최적화**: 하버사인 거리 + 최근접이웃을 **프레임워크 비의존 순수 로직(`RouteOptimizer`)** 으로 분리 → **Docker 없이 단위 테스트로 검증**(서울–부산 거리·정렬·총거리).
- **채팅 접근제어**: 채팅방이 **자체 멤버십(ChatRoomMember)** 을 소유해 타 도메인 침범 없이 권한 판단. 쓰기는 **인증 REST**, 실시간 수신은 **STOMP 브로드캐스트**로 분리해 WS 핸드셰이크 인증 복잡도를 회피.

### 9.5 테스트 전략

- **Testcontainers 통합 테스트**로 실제 Postgres/Redis에 붙여 **전 마이그레이션 적용 + Hibernate `validate` + 엔드포인트 플로우**를 검증.
- Docker가 필요한 통합 테스트는 **`@Tag("integration")`으로 분리** → 기본 `./gradlew build`(CI)는 Docker 없이 green을 유지하면서 **전체 컴파일 + 순수 단위 테스트**를 항상 실행.

### 9.6 마이그레이션 중 해결한 함정 (트러블슈팅)

| 상황 | 원인 | 해결 |
| --- | --- | --- |
| 컨트롤러 전역 컴파일 실패 | record 컴포넌트 접근자 `success()` 와 정적 팩터리 `success()` **시그니처 충돌** | 팩터리를 `onSuccess`/`onSuccessEmpty`/`onFailure`로 개명 |
| `validate` 스키마 불일치 위험 | `@Lob String` → Postgres `oid` 매핑 (DDL은 `text`) | `@Column(columnDefinition = "text")`로 정렬 |
| 응답 boolean 필드 매핑 누락 | MapStruct 프로퍼티명 규칙(`isRead` ↔ `read`) 불일치 | 해당 응답은 서비스에서 **명시적으로 조립** |
| 토큰 빌더 컴파일 오류 | `JWT.create()` 반환 타입 오인(`JWT.Builder`) | `JWTCreator.Builder`로 수정 |
| Java 21/Boot 3.5 빌드 불가 | Gradle Wrapper가 레거시 `7.6.1` | Wrapper를 `8.14`로 갱신(래퍼 jar 재사용) |

## 10. 프로젝트 구조

```
trip/
├─ apps/
│  └─ web/                 # Next.js — 라우팅/페이지 서빙 전용 (@ui 렌더)
├─ packages/
│  └─ ui/                  # 🎯 프론트 본체: 디자인 시스템 + FSD (shared 구축 완료)
├─ server/                 # 🎯 백엔드 재작성: Spring Boot (Java 21, Gradle KTS)
│  └─ src/main/java/com/tripplannerz/   # global · domain/*
│     └─ src/main/resources/db/migration # Flyway V1~V13
├─ client/                 # 🗄️ 프론트 레거시(2023, CRA·JS) — 참조용
├─ .circleci/config.yml    # CI (frontend / backend 잡)
├─ docker-compose.yml      # 로컬 인프라 (PostgreSQL + Redis)
├─ turbo.json · pnpm-workspace.yaml
```

> 백엔드 레거시(`/src`)는 재작성 완료 후 제거했습니다(git 히스토리에 보존).

## 11. 시작하기

### 요구 사항

- Node.js **≥ 20.11** · pnpm **≥ 9**
- JDK **21** · Docker (로컬 Postgres/Redis)

### 프론트엔드

```bash
pnpm install
cp packages/ui/.env.example packages/ui/.env
pnpm dev                       # 전체 워크스페이스 dev
pnpm --filter @ui storybook    # 디자인 시스템 (http://localhost:6006)
```

### 백엔드

```bash
docker compose up -d                    # PostgreSQL + Redis
cd server && ./gradlew bootRun          # http://localhost:8080 (profile: local)
# Swagger UI: /swagger-ui   ·   OpenAPI: /v3/api-docs
```

### 테스트

```bash
cd server
./gradlew test              # 단위/슬라이스 (Docker 불필요, CI에서 실행)
./gradlew integrationTest   # Testcontainers 통합 (Docker 필요)
```

## 12. 품질 · 테스트 · CI/CD

- **프론트**: Jest + Testing Library · Playwright(E2E) · MSW · Storybook + Chromatic
- **백엔드**: JUnit 5 · 순수 단위 테스트(`RouteOptimizer` 등) · `@SpringBootTest` + **Testcontainers**(`@Tag("integration")`으로 분리)
- **CI (CircleCI)** — `.circleci/config.yml`
  - `frontend`: pnpm install → `lint` → `typecheck` → `test` → `build`
  - `backend`: `./gradlew build` — **전체 컴파일 + 단위 테스트**(Docker 불필요, 통합 테스트는 별도 실행)
- **커밋 게이트**: Husky `pre-commit`(lint-staged) · `commit-msg`(commitlint, Conventional Commits)
- **관측**: Actuator + Micrometer(백엔드) · 번들/힙 분석(`check:heap`, 프론트)

## 13. 재구성 로드맵 (Legacy → Rewrite)

### 무엇을, 왜 바꿨나

| 영역 | 2023 (Legacy) | 2026 (Rewrite) | 이유 |
| --- | --- | --- | --- |
| FE 프레임워크 | CRA (webpack) | Next.js 16 App Router | SSR/BFF · 성능 · 유지보수 |
| 언어 | JS / Java 17 | TypeScript / **Java 21** | 타입 안정성 · 최신 언어 기능 |
| 저장소 | 단일 레포 | Turborepo 모노레포 | 앱/디자인시스템 분리 |
| BE 프레임워크 | Spring Boot 3.0.5 | **Spring Boot 3.5** + Gradle KTS | 최신 · 보안 패치 · 타입 안전 빌드 |
| BE 구조 | 단일 패키지 | **Package-by-Feature** | 도메인 경계 · 확장성 |
| 스키마 관리 | `ddl-auto: create` | **Flyway + validate** | 재현 가능 · 안전한 마이그레이션 |
| 인증 | JWT(단순) | JWT + **Redis refresh 회전** | 탈취 내성 · stateless |
| 문서/테스트 | 없음 / 빈약 | springdoc · **Testcontainers** | 계약 · 실제에 가까운 검증 |
| CI/CD | Travis + DockerHub + EB | **CircleCI**(front/back 분리) | 죽은 파이프라인 정리 |
| 시크릿 | 평문 커밋 | **전부 ENV 주입** | 보안 |

### 구현 현황

- [x] 프론트 모노레포/툴체인 · `shared` 레이어 · 디자인 시스템(Button)/Storybook
- [x] `apps/web` Next.js 스캐폴딩(서빙 전용)
- [x] 백엔드 스캐폴딩(Gradle KTS · global 공통 계층) · 로컬 인프라 · CircleCI
- [x] **백엔드 도메인 전체**: member(JWT) · trip(+경로 최적화) · companion(지원 플로우) · budget/settlement · notification · chat(STOMP)
- [x] Testcontainers 통합 + 순수 단위 테스트
- [ ] 프론트 `entities`/`features`/`pages` 레이어 및 API 연동
- [ ] STOMP 구독 인가(ChannelInterceptor) · OAuth2 소셜 로그인 · 리뷰/평점
- [ ] E2E(Playwright) 시나리오 커버리지

## 14. 비즈니스 모델 & 지표

**수익 모델(가설)**

- 🅿️ **Freemium**: 무료 일정 관리 + 프리미엄(무제한 일정, 고급 경로 최적화, 우선 매칭)
- 🤝 **동행 매칭 수수료**: 정산 처리 시 소액 수수료
- 🏨 **제휴 커머스**: 숙소/투어/보험 추천 어필리에이트

**핵심 지표**

- North Star: **정산까지 완료된 동행 여행 수**
- 보조: 일정 생성률 · 동행 신청→수락 전환율 · 7일 재방문율(WAU/MAU)

## 15. 팀 & 기간

- **기간**: 2023.04 – 2023.11 (MVP) · 2026 – (리라이트)
- **인원**: FE 1 (이동욱) · BE 2 (홍용현, 최성보)
- **역할(리라이트)**: 모노레포/FSD 설계, 백엔드 재작성(도메인 설계·인증·마이그레이션·테스트), CI/품질 게이트

---

<p align="center">
  <sub>Made with ☕ and wanderlust — TripPlannerZ</sub>
</p>
