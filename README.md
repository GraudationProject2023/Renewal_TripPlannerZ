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
  <img alt="license" src="https://img.shields.io/badge/license-MIT-black">
</p>

---

> **📌 이 문서에 대하여**
> 2023년 졸업작품으로 만든 프로젝트(`/client`, CRA · JavaScript)를 2026년 현재
> 실서비스 수준으로 재설계하는 리라이트 기록입니다.
> 레거시 코드는 보존하되(`/client`), 신규 구현은 모노레포(`/packages`, `/apps`)로 이관합니다.
> 아래 기능 명세는 제품 스펙 기준이며, 실제 구현 현황은 [재구성 로드맵](#10-재구성-로드맵-legacy--rewrite)에서 상태로 구분합니다.

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [문제 정의와 해결 가설](#2-문제-정의와-해결-가설)
3. [핵심 기능](#3-핵심-기능)
4. [기술 스택](#4-기술-스택)
5. [시스템 아키텍처](#5-시스템-아키텍처)
6. [프론트엔드 아키텍처 (FSD)](#6-프론트엔드-아키텍처-fsd)
7. [프로젝트 구조](#7-프로젝트-구조)
8. [시작하기](#8-시작하기)
9. [품질 · 테스트 · CI/CD](#9-품질--테스트--cicd)
10. [재구성 로드맵 (Legacy → Rewrite)](#10-재구성-로드맵-legacy--rewrite)
11. [비즈니스 모델 & 지표](#11-비즈니스-모델--지표)
12. [팀 & 기간](#12-팀--기간)

---

## 1. 프로젝트 개요

코로나19 이후 여가·관광 수요가 빠르게 회복되면서, 특히 **나 홀로 여행(솔로 트래블)** 시장이
구조적으로 성장했습니다. 자유도는 높지만 (1) 1인 부담 비용이 크고, (2) 안전·심리적 진입장벽이 있으며,
(3) 여행 계획을 세우는 과정 자체가 번거롭다는 페인 포인트가 뚜렷합니다.

**TripPlannerZ**는 이 세 가지를 하나의 제품 안에서 해결합니다.

- 🗺️ **일정 설계** — 목적지·기간·예산만 입력하면 초안 일정을 구성하고, 드래그 앤 드롭으로 다듬습니다.
- 💸 **예산 관리** — 항목별 지출을 계획/집행하고 동행자와 실시간 정산합니다.
- 🤝 **동행 매칭** — 겹치는 일정·성향·예산대를 기준으로 함께 갈 사람을 찾습니다.
- 🧭 **타임라인 & 경로 최적화** — 하루 동선을 최단 경로로 재배치해 이동 낭비를 줄입니다.

2023년 졸업작품 MVP에서 검증한 핵심 흐름(일정→동행→정산)을 유지하면서,
확장 가능한 아키텍처와 운영 체계를 갖춘 **상용 서비스**로 다시 만듭니다.

## 2. 문제 정의와 해결 가설

| 사용자 페인 포인트              | 기존 대안의 한계                             | TripPlannerZ의 접근                     |
| ------------------------------- | -------------------------------------------- | --------------------------------------- |
| 1인 여행 비용 부담              | 카페/오픈채팅 동행 모집은 신뢰·정산이 어려움 | 프로필·리뷰 기반 매칭 + 자동 정산       |
| 일정 짜기가 번거로움            | 지도·블로그·메모장을 오가며 수작업           | 초안 자동 생성 + DnD 편집 + 경로 최적화 |
| 안전·신뢰 우려                  | 상대에 대한 정보 부족                        | 본인 인증, 매너 평점, 신고/차단         |
| 언어 장벽 (인바운드/아웃바운드) | 국문 전용 서비스                             | i18n 다국어(ko/en) 기본 내장            |

> **핵심 가설**: "일정 → 동행 → 정산"을 끊김 없이 한 흐름으로 제공하면,
> 동행 매칭의 전환율과 재방문율이 유의미하게 올라간다.

## 3. 핵심 기능

### 3.1 여행 일정 (Itinerary)

- 목적지 · 기간 · 예산 · 테마 입력 기반 **일정 초안 생성**
- 일자별 카드 구성, **드래그 앤 드롭 재정렬** (`react-dnd`)
- 장소별 메모 · 예상 비용 · 체류 시간 태깅
- 일정 **공유 링크** 및 공개/비공개 설정

### 3.2 타임라인 & 경로 최적화 (Route Optimization)

- 하루 방문지들을 **최단 동선으로 자동 재배치**
- 대중교통/도보/자차 이동 수단별 소요 시간 추정
- 시간대별 타임라인 시각화

### 3.3 동행자 매칭 (Companion Matching)

- 일정 겹침 · 예산대 · 여행 성향 기반 **추천 매칭**
- 동행 모집 글 작성 / 지원 / 수락 플로우
- 매너 평점 · 후기 · 신고/차단으로 신뢰 확보

### 3.4 예산 & 정산 (Budget & Settlement)

- 계획 예산 vs 실제 지출 비교 대시보드
- 동행자 간 **N빵 정산** 및 항목별 분담

### 3.5 실시간 커뮤니케이션

- 동행 확정자 간 채팅
- 일정 변경 · 지원 · 정산에 대한 **실시간 알림**

### 3.6 계정 & 신뢰

- 소셜 로그인(OAuth) · 본인 인증
- 토큰 기반 세션 관리 (access/refresh)
- 약관 동의 흐름 (`shared/config/terms.ts`)

### 3.7 국제화 (i18n)

- `i18next` 기반 다국어(ko/en), 브라우저 언어 자동 감지
- 번역 키 스캔/동기화 스크립트(`i18n:scan`, `i18n:sync`)로 운영 자동화

## 4. 기술 스택

**Core**

- **Next.js 16** (App Router) · **React 19** (React Compiler) · **TypeScript 5.9**
- **Turborepo** 기반 pnpm 모노레포 · **Tailwind CSS 4**

**상태 · 데이터**

- 서버 상태: **TanStack Query** (+ persist / storage sync)
- 클라이언트 상태: **Zustand**
- 폼 · 검증: **React Hook Form** + **Zod** (`@hookform/resolvers`)
- HTTP: **Axios** (인터셉터 · 토큰 리프레시 · 이미지 프록시)

**UX**

- **react-dnd** (일정 타임라인 드래그 앤 드롭)
- **react-markdown** + **DOMPurify** (안전한 마크다운 렌더링)
- **next-themes** (다크 모드) · **date-fns** · **react-icons**

**품질 · 문서화**

- **Storybook 8** (+ Chromatic) — 디자인 시스템/컴포넌트 문서
- **Jest** + **Testing Library** (단위/통합) · **Playwright** (E2E)
- **MSW** (API 모킹)

**개발 경험 · 규약**

- **ESLint** (flat config) · **Prettier** · **Husky** + **lint-staged** · **commitlint**
- **Changesets** (패키지 버전 관리)

## 5. 시스템 아키텍처

![시스템 아키텍처 최종](https://github.com/GraudationProject2023/Client/assets/97590636/fd894fdf-fb06-4fae-99ca-feaaa075a1af)

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Client    │────▶│   Next.js App     │────▶│   API Server  │
│ (Web/Mobile)│     │  (SSR / BFF)      │     │  (REST)       │
└─────────────┘     └──────────────────┘     └───────┬───────┘
                              │                       │
                    ┌─────────┴─────────┐   ┌─────────┴─────────┐
                    │  Image Proxy /    │   │   PostgreSQL      │
                    │  Static / CDN     │   │   (일정/동행/정산) │
                    └───────────────────┘   └───────────────────┘
```

- **BFF 계층**: Next.js에서 인증 콜백/이미지 프록시/리다이렉트 등 클라이언트 경계 로직 처리
  (`shared/config/api.ts`, `shared/config/image-proxy.ts`)
- **인프라**: Docker · Nginx 리버스 프록시 · (레거시) Travis CI → 현행 GitHub Actions 이관 예정
- **배포**: Vercel(프론트) + 컨테이너 기반 백엔드 (`docker-compose.yml`)

## 6. 프론트엔드 아키텍처 (FSD)

**Feature-Sliced Design**을 채택해 레이어 간 의존 방향을 단방향으로 강제합니다.

```
app  →  processes  →  pages  →  widgets  →  features  →  entities  →  shared
(상위 레이어만 하위 레이어를 참조. 역방향 import 금지)
```

현재 `packages/ui/shared` 레이어가 기반으로 구축되어 있습니다.

- `shared/ui` — 디자인 시스템 프리미티브 (`Button` 등, Storybook 연동)
- `shared/api` — API 계약 타입 · 엔드포인트 정의
- `shared/lib` — 유틸리티 (auth 토큰, 포맷터, 마크다운, 파일, 폴리필, 힙 측정 등)
- `shared/config` — 앱/레이아웃/이미지 프록시/약관/환경 설정

## 7. 프로젝트 구조

```
trip/
├─ apps/                  # 실행 가능한 애플리케이션 (web 등) — 이관 진행 중
├─ packages/
│  └─ ui/                 # 🎯 최신 버전: 디자인 시스템 + FSD shared 레이어
│     ├─ shared/
│     │  ├─ ui/           # 컴포넌트 (Button, ...)
│     │  ├─ api/          # API 타입/클라이언트
│     │  ├─ lib/          # utils (auth, format, markdown, file, i18n ...)
│     │  └─ config/       # app/api/layout/image-proxy/terms/env
│     ├─ global.css       # Tailwind v4 토큰
│     └─ .storybook/      # 컴포넌트 문서
├─ client/                # 🗄️ 레거시(2023, CRA·JS) — 참조용 보존
├─ turbo.json             # 태스크 파이프라인
├─ pnpm-workspace.yaml
└─ docker-compose.yml     # 로컬 풀스택 구동
```

## 8. 시작하기

### 요구 사항

- Node.js **≥ 20.11**
- pnpm **≥ 9**

### 설치 & 실행

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정 (packages/ui/.env.example 참고)
cp packages/ui/.env.example packages/ui/.env

# 3. 개발 서버 (turbo가 전체 워크스페이스 dev 실행)
pnpm dev

# 4. 디자인 시스템(Storybook)
pnpm --filter @ui storybook   # http://localhost:6006
```

> 💡 도커로 백엔드까지 한 번에: `docker-compose up`

### 주요 스크립트

| 명령                          | 설명                        |
| ----------------------------- | --------------------------- |
| `pnpm dev`                    | 전체 워크스페이스 개발 서버 |
| `pnpm build`                  | 프로덕션 빌드               |
| `pnpm test`                   | 테스트 실행                 |
| `pnpm typecheck`              | 타입 체크                   |
| `pnpm lint` / `pnpm lint:fix` | 린트 검사 / 자동 수정       |
| `pnpm format`                 | Prettier 포맷팅             |
| `pnpm --filter @ui i18n:scan` | 번역 키 스캔                |

## 9. 품질 · 테스트 · CI/CD

- **테스트 전략**
  - 단위/통합: **Jest** + **Testing Library**
  - E2E: **Playwright**
  - 네트워크 모킹: **MSW** (개발/테스트 공용 핸들러)
- **디자인 시스템**: **Storybook** + **Chromatic** 비주얼 리그레션
- **커밋 게이트**: Husky `pre-commit`(lint-staged) · `commit-msg`(commitlint, Conventional Commits)
- **버전 관리**: Changesets로 패키지 릴리즈 노트/버전 자동화
- **성능 관측**: 번들 분석 · 힙 사용량 측정 스크립트(`check:heap`)

## 10. 재구성 로드맵 (Legacy → Rewrite)

3년 전 대비 무엇을, 왜 바꿨는지에 대한 기록입니다.

| 영역       | 2023 (Legacy)  | 2026 (Rewrite)            | 이유                             |
| ---------- | -------------- | ------------------------- | -------------------------------- |
| 프레임워크 | CRA (webpack)  | Next.js 16 App Router     | SSR/BFF, 라우팅, 성능, 유지보수  |
| 언어       | JavaScript     | TypeScript                | 타입 안정성 · 리팩터링 내성      |
| 저장소     | 단일 레포      | Turborepo 모노레포        | 디자인 시스템/앱 분리, 캐시 빌드 |
| 상태 관리  | 로컬 상태 위주 | TanStack Query + Zustand  | 서버/클라 상태 분리              |
| 폼         | 수동 검증      | RHF + Zod                 | 선언적 검증 · 재사용             |
| 스타일     | CSS            | Tailwind v4 + 디자인 토큰 | 일관성 · 속도                    |
| 문서화     | 없음           | Storybook + Chromatic     | 컴포넌트 계약 · 협업             |
| 국제화     | 국문 전용      | i18next 다국어            | 글로벌 확장                      |

**구현 현황 (체크리스트)**

- [x] 모노레포/툴체인(Turbo, ESLint flat, Husky, commitlint, Changesets)
- [x] `shared` 레이어(config/lib/api/ui) 기반
- [x] 디자인 시스템 프리미티브(Button) · Storybook 셋업
- [x] Axios 인스턴스 · 토큰 · 이미지 프록시 · i18n 스캐폴딩
- [ ] `entities` / `features` 레이어 이관
- [ ] 일정 · 타임라인 DnD · 경로 최적화
- [ ] 동행 매칭 · 채팅 · 정산
- [ ] E2E(Playwright) 시나리오 커버리지

## 11. 비즈니스 모델 & 지표

**수익 모델(가설)**

- 🅿️ **Freemium**: 무료 일정 관리 + 프리미엄(무제한 일정, 고급 경로 최적화, 우선 매칭)
- 🤝 **동행 매칭 수수료**: 정산 처리 시 소액 수수료
- 🏨 **제휴 커머스**: 숙소/투어/보험 추천 어필리에이트

**핵심 지표(North Star & 보조)**

- North Star: **정산까지 완료된 동행 여행 수**
- 보조: 일정 생성률 · 동행 신청→수락 전환율 · 7일 재방문율(WAU/MAU)

## 12. 팀 & 기간

- **기간**: 2023.04 – 2023.11 (MVP) · 2026 – (리라이트)
- **인원**: FE 1 (이동욱) · BE 2 (홍용현, 최성보)
- **역할(FE)**: 아키텍처 설계, 디자인 시스템, 상태/데이터 계층, i18n, CI/품질 게이트

---

<p align="center">
  <sub>Made with ☕ and wanderlust — TripPlannerZ</sub>
</p>
