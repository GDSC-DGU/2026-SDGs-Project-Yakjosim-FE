# UX/UI Handoff

이 문서는 다음 개발자가 이 프로젝트의 UX/UI 개선 작업을 바로 이어받을 수 있도록 정리한 핸드오프 문서다.
현재 기능 기준은 [`docs/specs/functional-spec-v2.md`](/Users/eun/dev/GDGoC/demo_day/docs/specs/functional-spec-v2.md:1)를 우선 따른다.

## 문서 구성

- `docs/ux-ui/00-project-overview.md`: 실행 방법, 기술 스택, 현재 파일 구조, 전체 아키텍처
- `docs/ux-ui/01-current-state.md`: 현재 구조, 사용자 흐름, 공통 문제
- `docs/ux-ui/02-design-system.md`: 디자인 시스템/레이아웃/접근성 관점 정리
- `docs/ux-ui/03-page-improvements.md`: 페이지별 개선 포인트
- `docs/ux-ui/04-priority-backlog.md`: 우선순위 기준 실행 백로그
- `docs/ux-ui/05-ai-collaboration-guide.md`: AI를 활용해 작업할 때의 프롬프트/검증 지침

## 먼저 읽을 파일

- 앱 라우팅: `src/App.tsx`
- 공통 페이지 셸: `src/components/layout/PageContainer.tsx`
- 헤더/하단 네비: `src/components/layout/AppHeader.tsx`, `src/components/layout/BottomNav.tsx`
- 테마 토큰: `src/styles/theme.css`, `src/styles/globals.css`
- 공통 카드/배지/입력: `src/components/common/*`

## 빠른 요약

- 현재 UI는 기능 흐름은 갖춰졌지만, 최신 비회원 MVP 기준과 기존 화면 구조 사이에 차이가 있다.
- 페이지마다 `fixed` 버튼, 하단 네비, 본문 `padding` 규칙이 달라서 겹침 위험이 있다.
- `seniorMode` 상태는 있으나 실제 루트 DOM 속성 연결이 없어 접근성 기능이 동작하지 않는다.
- 위험도 배지, 칩, 카드가 각자 색을 정의하고 있어 시각 언어가 분산되어 있다.
- 비어 있음, 로딩 중, 오류, 성공 상태의 톤앤매너가 통일되어 있지 않다.
- 홈 검색창, 마이페이지, 저장 흐름 등은 새 명세 기준으로 재정리 대상이다.

## 권장 작업 순서

1. `docs/specs/functional-spec-v2.md`를 읽고 현재 MVP 범위 확인
2. `00-project-overview.md`를 읽고 실행 방법, 구조, 기술 스택 파악
3. `02-design-system.md` 기준으로 토큰과 레이아웃 규칙부터 통일
4. `04-priority-backlog.md`의 P0 항목 처리
5. `03-page-improvements.md` 기준으로 주요 사용자 흐름 화면 순차 개선
6. `05-ai-collaboration-guide.md`의 검증 규칙에 따라 AI 출력물 점검
7. 마지막에 접근성 점검과 모바일 실기기 확인

## 빠른 시작

```bash
pnpm install
pnpm dev
```

빌드는 아래 명령으로 확인한다.

```bash
pnpm build
```
