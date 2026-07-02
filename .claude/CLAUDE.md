# CLAUDE.md — TripPlannerZ

이 문서는 이 저장소에서 작업할 때 Claude가 반드시 따라야 하는 규칙이다.
여기 적힌 지침은 기본 동작보다 우선한다.

---

## 0. 프로젝트 한 줄 요약

여행 일정 관리 · 예산 설계 · 동행자 매칭 플랫폼(TripPlannerZ)을
**3년 전 CRA·JS 졸업작품(`/client`)에서 모노레포·TS·FSD로 처음부터 재구축**하는 프로젝트다.

- `/client` — 프론트 레거시(2023). **참조 전용, 절대 수정하지 않는다.** 요구사항/UX 참고용.
- 백엔드 레거시(`/src`, Spring Boot 3.0.5 · Java 17)는 **재작성 완료 후 삭제**됨(필요 시 git 히스토리 참조).
- 프론트 신규 작업은 `packages/ui`(FSD) + `apps/web`(서빙), 백엔드 신규 작업은 `/server` 재작성 스펙 기준으로 진행한다.

---

## 1. 아키텍처 대원칙 (가장 중요)

> **모든 기능·로직·UI는 `packages/ui`(`@ui`)에 FSD로 구현한다.**
> **`apps/web`(Next.js)은 "페이지 서빙" 역할만 한다.**

- `apps/web`는 라우팅과 서버 진입점만 담당한다. App Router의 각 `page.tsx`는
  `@ui`의 `pages` 레이어 컴포넌트를 **가져와서 렌더링만** 한다.
- `apps/web`에 비즈니스 로직, 상태, API 호출, 도메인 컴포넌트를 **작성하지 않는다.**
  그런 코드가 필요하면 `packages/ui`의 적절한 FSD 레이어에 만들고 `@ui`에서 import 한다.
- 새 기능 요청 = 기본적으로 `packages/ui` 안에서 작업한다고 전제한다.

```
apps/web/app/trip/[id]/page.tsx      ← "서빙만"
  └─ import { TripDetailPage } from '@ui' (또는 'ui/...')
       packages/ui/pages/trip-detail/...  ← 실제 화면 조립
```

---

## 2. FSD (Feature-Sliced Design)

레이어 의존 방향은 **상위 → 하위 단방향**이며 역방향 import는 금지한다.

```
app → processes → pages → widgets → features → entities → shared
```

- **shared** — 프레임워크/도메인 무관 재사용 코드. 이미 구축됨: `shared/{ui,api,lib,config}`
- **entities** — 도메인 모델 단위(trip, user, companion, budget, settlement …). 타입·API·기본 UI·store.
- **features** — 사용자 행동 단위(일정-DnD-편집, 동행-지원, 정산-생성 …).
- **widgets** — features/entities를 조합한 화면 블록(헤더, 일정 타임라인 패널 …).
- **pages** — 라우트 1개에 대응하는 화면 전체 조립. `apps/web`가 이걸 렌더한다.

### 슬라이스 내부 구조 (segment)

각 슬라이스는 목적별 세그먼트로 나눈다: `ui/`, `model/`(store·hooks·state), `api/`, `lib/`, `config/`.
슬라이스 루트에는 **public API 역할의 `index.ts`(배럴)** 를 두고, 외부에서는 반드시 배럴로만 import 한다.
슬라이스 내부 파일을 깊게 직접 import 하지 않는다.

### import 규칙

- 크로스 레이어 import는 **하위 레이어의 public API(배럴)만** 사용한다.
- 같은 레이어의 다른 슬라이스끼리는 원칙적으로 import 하지 않는다(교차 의존 금지).
- 절대경로 alias: **`ui/*` → `packages/ui/*`** (root `tsconfig.json`에 정의됨). 상대경로 `../../..` 지양.

---

## 3. 기술 스택 (이 스택 밖으로 나가지 말 것)

- **Next.js 16 (App Router)** · **React 19** · **TypeScript 5.9 (strict)**
- **Turborepo** + **pnpm 9** 워크스페이스 · **Tailwind CSS 4**
- 서버 상태: **TanStack Query** / 클라이언트 상태: **Zustand**
- 폼·검증: **React Hook Form + Zod** (`@hookform/resolvers`)
- HTTP: **Axios** (`shared/lib/utils/api/axiosInstance.ts` — 인터셉터·토큰·프록시)
- i18n: **i18next / react-i18next** (ko/en)
- UI 보조: **react-dnd**(타임라인 DnD), **react-markdown + DOMPurify**, **next-themes**, **date-fns**, **react-icons**, **clsx**
- 문서/테스트: **Storybook 8 + Chromatic**, **Jest + Testing Library**, **Playwright**, **MSW**

새 의존성이 정말 필요하면 먼저 제안하고, 위 스택으로 해결 가능한지부터 검토한다.

---

## 4. 코드 컨벤션

- **TypeScript strict**: `strictNullChecks`, `noUncheckedIndexedAccess` 켜져 있음. `any` 금지, 타입 단언 최소화.
- **배럴 익스포트**: 모든 폴더는 `index.ts`로 public API를 노출한다(named export 위주). `export * from './X'` 패턴을 따른다.
- **컴포넌트**: 함수형 + 화살표 함수 + named export. `props` 타입은 `type XxxProps = {...}`로 파일 상단 정의.
  (기존 `shared/ui/Button/Button.tsx` 스타일을 그대로 따른다.)
- **스타일링**: Tailwind v4 유틸 + **디자인 토큰**(`bg-primary-600`, `text-l500-14` 등 `global.css` 정의) 사용.
  조건부 클래스는 **clsx**로 처리. 임의 색/사이즈 하드코딩 대신 토큰을 쓴다.
- **상태 분리**: 서버에서 오는 데이터는 TanStack Query, 순수 클라이언트 UI 상태만 Zustand. 둘을 섞지 않는다.
- **폼**: RHF + Zod 스키마로 검증. 스키마는 해당 슬라이스의 `model/` 또는 `lib/`에 둔다.
- **파일/폴더 네이밍**: 컴포넌트/슬라이스 폴더는 도메인 의미가 드러나게. 기존 코드의 케이스 관습을 따른다.
- **주석/언어**: 코드 주석과 커밋은 기존 톤을 따르되, 사용자와의 대화는 한국어로 한다.

---

## 5. 명령어

패키지 매니저는 **pnpm**. (설치 명령은 아래 8절 참고 — 직접 실행하지 않는다.)

```bash
pnpm dev                       # 전체 워크스페이스 dev (turbo)
pnpm build                     # 프로덕션 빌드
pnpm test                      # 테스트
pnpm typecheck                 # 타입 체크
pnpm lint  /  pnpm lint:fix    # 린트
pnpm format                    # prettier
pnpm --filter @ui storybook    # 디자인 시스템 (6006)
pnpm --filter @ui test         # ui 패키지 테스트만
```

작업 완료 전 최소 `pnpm typecheck`와 `pnpm lint`가 통과하는지 확인한다.

---

## 6. 커밋 / PR

- **Conventional Commits**(commitlint + Husky) 준수: `feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:` …
  (기존 히스토리 예: `feat: shared layer`, `feat: utils api`)
- 커밋/푸시는 **사용자가 명시적으로 요청할 때만** 한다.
- `main`에서 직접 작업 요청이 와도, 커밋이 필요하면 먼저 브랜치를 판다.

---

## 7. 하지 말 것 (Don't)

- ❌ `apps/web`에 도메인 로직·상태·API·복잡한 컴포넌트 작성 (→ `packages/ui`로)
- ❌ 프론트 레거시 `/client` 수정 (참조 전용). 백엔드 레거시 `/src`는 재작성 대상이지만, 재작성 스펙과 무관한 부분을 임의로 방치·복붙하지 않는다.
- ❌ 슬라이스 내부 파일 깊은 직접 import (배럴만 사용)
- ❌ FSD 역방향/교차 의존
- ❌ 디자인 토큰 무시하고 색/간격 하드코딩
- ❌ 스택 밖 라이브러리 임의 추가

---

## 8. 환경 · 도구 메모

- 환경변수는 `packages/ui/.env.example` 참고 (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_SUPABASE_*` 등). `IS_DEV` 판별은 `shared/config/env.ts` 사용.
- **패키지 설치 명령(pnpm/npm install 등)은 Claude가 직접 실행하지 않고 사용자에게 넘긴다.**

---

# 백엔드 (Server) — Java · Spring Boot

> 레거시 서버(`/src`, Spring Boot 3.0.5 · Java 17 · 단일 패키지)는 **거의 전면 재작성**한다.
> 도메인 지식(회원·여행·동행·위치·댓글/알림 등)만 계승하고, 구조·인증·API 계약·품질 기준은 아래를 새 기준선으로 삼는다.

## 9. 목표 & 설계 원칙

- **API-first**: 프론트(`@ui`)의 계약이 곧 서버 계약이다. OpenAPI 스펙을 단일 진실 소스로 유지한다.
- **명확한 경계**: 도메인(비즈니스 규칙)과 인프라(JPA/외부 API/웹)를 섞지 않는다.
- **얇은 컨트롤러, 두꺼운 서비스/도메인**: 컨트롤러는 검증·변환·위임만. 규칙은 도메인/서비스에.
- **불변 우선**: DTO는 `record`, 엔티티는 setter 남발 금지(의미 있는 메서드로 상태 변경).
- **재현 가능**: 스키마는 마이그레이션으로, 테스트는 컨테이너로, 실행은 프로파일로 결정한다.

## 10. 기술 스택 (신규 기준선)

- **Java 21 (LTS)** — record, sealed, pattern matching, **virtual threads** 활용
- **Spring Boot 3.5.x** · **Gradle (Kotlin DSL 권장, `build.gradle.kts`)**
- **Spring Web (MVC)** · **Spring Data JPA** · **QueryDSL 5 (jakarta)**
- **PostgreSQL** (주 저장소) · **Redis** (토큰·캐시·세션·rate limit)
- **Spring Security 6** + **OAuth2 Client/Resource Server** + **JWT** (access/refresh)
- **Flyway** (스키마 마이그레이션, `V{n}__desc.sql`)
- **Bean Validation (Jakarta Validation)**
- **springdoc-openapi** (Swagger UI / OpenAPI 3)
- **MapStruct** (엔티티↔DTO 매핑) · **Lombok** (보일러플레이트, 아래 정책 준수)
- **WebSocket + STOMP** (채팅·실시간 알림) · **Spring Mail** (인증 메일)
- 관측: **Spring Boot Actuator** + **Micrometer**
- 테스트: **JUnit 5** · **Testcontainers** (Postgres/Redis) · **MockMvc/RestAssured** · **AssertJ**

> 위 스택 밖 라이브러리는 먼저 제안 후 도입한다. 레거시의 `webflux`/`WebClient`는
> 외부 API 호출 용도로만 제한적으로 사용하고, 애플리케이션 전반은 MVC로 통일한다.

## 11. 패키지 구조 (Package-by-Feature)

기술 계층 우선이 아니라 **도메인(기능) 우선**으로 나눈다. 도메인 내부에서만 계층을 둔다.

```
com.tripplannerz
├─ global/                      # 횡단 관심사 (도메인 무관)
│  ├─ config/                   # Security, Jpa(Auditing), OpenAPI, Cors, WebSocket(STOMP)
│  ├─ common/                   # ApiResponse, PageResponse, BaseEntity(감사필드)
│  ├─ error/                    # ErrorCode(enum), BusinessException, GlobalExceptionHandler
│  └─ security/                 # JwtProvider, JwtAuthenticationFilter, RefreshTokenStore(Redis)
└─ domain/
   ├─ member/                   # 회원/인증(JWT)  — controller·service·repository·entity·dto·mapper
   ├─ trip/                     # 여행 일정 · 장소 · 경로 최적화(lib: RouteOptimizer)
   ├─ companion/                # 동행 모집/지원/매칭
   ├─ budget/                   # 지출 · 예산 요약 · 정산
   ├─ notification/             # 알림
   └─ chat/                     # 실시간 채팅 (STOMP)
```

- 도메인 간 참조는 **service 계층을 통해서만**. 다른 도메인의 repository/entity 직접 접근 금지.
- 연관은 **엔티티 참조 대신 식별자(id)** 로 보관해 결합을 낮춘다(FK는 DB에만).
- 순환 참조가 생기면 도메인 경계 설계가 틀린 신호로 보고 재검토한다.
- 경로 최적화 등 장소 로직은 별도 `location` 도메인이 아니라 **`trip` 도메인 내부**에 둔다(같은 애그리거트).

**표준 응답 팩터리**: `ApiResponse.onSuccess(data)` / `onSuccessEmpty()` / `onFailure(error)`
(record 컴포넌트 접근자 `success()`와의 충돌을 피하기 위해 `success/error`가 아닌 이 이름을 쓴다).

## 12. API 컨벤션

- **REST 원칙**: 자원 복수형 명사(`/api/v1/trips`), 행위는 HTTP 메서드로. 버전 프리픽스 `/api/v1`.
- **표준 응답 래퍼**: 모든 응답은 공통 포맷으로 감싼다.
  ```json
  { "success": true, "data": { }, "error": null }
  { "success": false, "data": null, "error": { "code": "TRIP_NOT_FOUND", "message": "..." } }
  ```
- **에러 코드**: `ErrorCode` enum(코드·HTTP status·기본 메시지)으로 중앙 관리. 문자열 코드는 프론트와 계약.
- **페이지네이션**: `page`/`size`/`sort` 쿼리, 응답은 `PageResponse`(content + 메타)로 통일.
- **상태 코드**: 생성 201, 조회 200, 없음 404, 검증 실패 400, 인증/인가 401/403, 서버 500.
- **날짜/시간**: 서버 저장·응답은 **UTC ISO-8601**. 표시는 클라이언트 책임.
- **문서화**: 컨트롤러/DTO에 springdoc 애너테이션. `/swagger-ui`, `/v3/api-docs` 제공.

## 13. 도메인 요구사항 (필수 기능)

프론트 기능 명세(3절)와 1:1로 대응하는 서버 필수 기능.

- **회원/인증**: 이메일 회원가입 + 메일 인증, 소셜 로그인(OAuth2), 로그인/로그아웃, 토큰 재발급, 회원 프로필·여행 성향(preference).
- **여행 일정**: 일정 CRUD, 일자별 항목, 공개/비공개, 공유 링크, 이미지 업로드.
- **위치/경로**: 장소 검색(외부 API 연동), 일정 내 장소 순서(order) 저장, **하루 동선 최단 경로 계산**.
- **동행 매칭**: 모집글 CRUD, 지원/수락/거절, 참여자(memberParty) 관리, 정원·중복지원 제어.
- **예산/정산**: 계획 예산·실제 지출, 참여자 간 분담/정산 계산.
- **소통**: 동행 확정자 채팅(STOMP), 지원/수락/정산 이벤트 **알림**.
- **신뢰/안전**: 매너 평점, 후기, 신고/차단.

## 14. 영속성 규칙

- 모든 엔티티는 `BaseEntity`(`createdAt`/`updatedAt`, JPA Auditing) 상속.
- 연관관계는 **지연 로딩(LAZY) 기본**, `@ManyToOne`은 명시적으로 LAZY 지정. N+1은 **fetch join / `@EntityGraph` / QueryDSL**로 해결.
- 동적/복잡 조회는 **QueryDSL** (`*RepositoryCustom` + `*RepositoryImpl`) 패턴 유지.
- 스키마 변경은 **반드시 Flyway 마이그레이션**으로. `ddl-auto`는 로컬 `validate`(운영은 `none`), `create/update` 금지.
- 트랜잭션: 조회는 `@Transactional(readOnly = true)`, 변경은 서비스 메서드 단위 `@Transactional`.

## 15. 보안 · 인증

- **JWT**: access(단수명) + refresh(장수명), **refresh는 Redis 저장/회전(rotation)** 및 로그아웃 시 블랙리스트.
- **Spring Security 6**: `SecurityFilterChain` 빈 기반 설정, 상태 없는(stateless) 세션, JWT 필터 체인.
- **인가**: 역할/권한 기반 접근제어, 리소스 소유자 검증(본인 일정/모집글만 수정).
- **입력 신뢰 금지**: 서버측 Bean Validation 필수. 인증 정보는 토큰에서만, 요청 바디의 userId 신뢰 금지.
- **비밀 관리**: 시크릿·키는 환경변수/외부 설정으로. 코드·레포에 하드코딩 금지.
- CORS는 `global/config`에서 프론트 오리진만 허용.

## 16. 예외 · 검증

- 비즈니스 예외는 `BusinessException(ErrorCode)` 하나로 통일, `@RestControllerAdvice`의 `GlobalExceptionHandler`에서 표준 에러 응답으로 변환.
- 검증 실패(`MethodArgumentNotValidException` 등)도 핸들러에서 필드 에러를 표준 포맷으로 반환.
- 예상 가능한 흐름 제어에 예외를 남용하지 않는다.

## 17. 테스트

- **단위**: 도메인/서비스 로직 (mock 최소화, 순수 로직 우선).
- **슬라이스**: `@WebMvcTest`(컨트롤러) · `@DataJpaTest`(리포지토리).
- **통합**: `@SpringBootTest` + **Testcontainers**(Postgres/Redis)로 실제에 가깝게.
- 핵심 도메인(정산 계산, 경로 최적화, 매칭 규칙)은 **경계값 테스트 필수**.
- 테스트는 서로 독립적·반복 가능해야 하며, 공유 가변 상태 금지.

## 18. 운영 · 관측성

- **Actuator**: health/info/metrics 노출(민감 엔드포인트는 보호).
- **로깅**: 구조적 로그 + 요청 상관관계 ID(MDC). 운영에서 민감정보 로깅 금지.
- **프로파일**: `local` / `dev` / `prod` 분리. 비밀은 프로파일별 외부 설정.
- **API 응답시간/에러율** 지표를 Micrometer로 수집.

## 19. 빌드 · 실행

```bash
./gradlew build            # 빌드 + 테스트
./gradlew test             # 테스트
./gradlew bootRun          # 로컬 실행 (SPRING_PROFILES_ACTIVE=local)
./gradlew clean            # 산출물 정리 (QueryDSL Q타입 포함)
```

- 로컬 인프라(Postgres/Redis)는 컨테이너로 기동한다.
- **QueryDSL Q타입은 생성물**이므로 커밋/수정 금지 (`src/main/generated`는 산출물 취급).

## 20. 백엔드 컨벤션 & Don't

- **DTO는 `record`**, 요청/응답 DTO를 엔티티와 분리(엔티티 직접 노출 금지).
- **Lombok 정책**: `@Getter`/`@Builder`/`@RequiredArgsConstructor`까지 허용. 엔티티 `@Setter`/`@Data` 금지, `@AllArgsConstructor` 남용 금지.
- **매핑은 MapStruct** 또는 명시적 정적 팩터리. 수기 매핑 산발 금지.
- **생성자 주입만** 사용(필드 주입 `@Autowired` 금지).
- 커밋은 프론트와 동일하게 Conventional Commits, 커밋/푸시는 사용자 요청 시에만.
- ❌ 엔티티를 컨트롤러 응답으로 그대로 반환 / ❌ `ddl-auto`로 스키마 관리 / ❌ 컨트롤러에 비즈니스 로직 / ❌ 다른 도메인 내부(repository·entity) 직접 침범 / ❌ 시크릿 하드코딩.
