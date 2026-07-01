# CLAUDE.md — TripPlannerZ

이 문서는 이 저장소에서 작업할 때 Claude가 반드시 따라야 하는 규칙이다.
여기 적힌 지침은 기본 동작보다 우선한다.

---

## 0. 프로젝트 한 줄 요약

여행 일정 관리 · 예산 설계 · 동행자 매칭 플랫폼(TripPlannerZ)을
**3년 전 CRA·JS 졸업작품(`/client`)에서 모노레포·TS·FSD로 처음부터 재구축**하는 프로젝트다.

- `/client` — 레거시(2023). **참조 전용, 절대 수정하지 않는다.** 요구사항/UX 참고용.
- `/src`, `/build`, `/postgres`, `/nginx`, `gradle*`, `docker*` 등 백엔드/인프라 — **지금은 건드리지 않는다.**
- 신규 작업은 오직 `packages/ui`와 `apps/web`에서만 한다.

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
- ❌ 레거시 `/client` 수정, 백엔드/인프라(`src`, `postgres`, `nginx`, gradle, docker) 손대기
- ❌ 슬라이스 내부 파일 깊은 직접 import (배럴만 사용)
- ❌ FSD 역방향/교차 의존
- ❌ 디자인 토큰 무시하고 색/간격 하드코딩
- ❌ 스택 밖 라이브러리 임의 추가

---

## 8. 환경 · 도구 메모

- 환경변수는 `packages/ui/.env.example` 참고 (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_SUPABASE_*` 등). `IS_DEV` 판별은 `shared/config/env.ts` 사용.
- **패키지 설치 명령(pnpm/npm install 등)은 Claude가 직접 실행하지 않고 사용자에게 넘긴다.**
