# Priority Backlog

## P0

### 0. 비회원 MVP 기준으로 화면 구조 정렬

- 문제: 기존 문서와 화면에는 회원, 저장, 마이페이지, 독립 OCR 전제가 섞여 있다.
- 기대 효과: 실제 개발 기준과 현재 UI가 같은 방향을 보게 된다.
- 시작 파일:
  - `docs/specs/functional-spec-v2.md`
  - `src/App.tsx`
  - `src/pages/HomePage.tsx`
  - `src/pages/OnboardingPage.tsx`

완료 조건:

- 홈/검색/분석/설정 중심 구조 정리
- 비회원 전용 흐름 반영
- 제거 대상 기능이 UI에서 노출되지 않음

### 1. `seniorMode` 실제 연결

- 문제: 설정 토글이 있으나 루트 DOM에 반영되지 않음
- 기대 효과: 접근성 기능이 실제 동작
- 시작 파일:
  - `src/main.tsx`
  - `src/App.tsx`
  - `src/contexts/UserContext.tsx`
  - `src/styles/globals.css`

완료 조건:

- 토글 시 `:root[data-senior="true"]`가 실제 반영
- 새로고침 이후 유지 여부 정책 결정

### 2. 공통 하단 CTA 패턴 정리

- 문제: `SearchPage`, `CombinationPage` 등에서 하단 고정 UI 규칙이 제각각
- 기대 효과: 모바일 겹침 방지, 코드 중복 감소
- 시작 파일:
  - `src/components/layout/PageContainer.tsx`
  - `src/pages/SearchPage.tsx`
  - `src/pages/CombinationPage.tsx`

완료 조건:

- 공통 `BottomActionBar` 또는 동등한 패턴 도입
- 본문 마지막 요소가 CTA 아래로 숨지 않음

### 3. 검색 UX 기본기 보강

- 문제: 결과 없음 상태와 키보드/스크린리더 고려 부족
- 기대 효과: 핵심 입력 플로우 안정화
- 시작 파일:
  - `src/components/common/SearchInput.tsx`
  - `src/pages/SearchPage.tsx`

완료 조건:

- 결과 없음 상태 제공
- 선택/포커스/로딩 상태 명확화
- 최소 키보드 탐색 또는 접근성 속성 추가

### 4. 홈 검색창 제거 및 랜딩형 홈 재구성

- 문제: 검색창이 실제 검색처럼 보이지만 이동 트리거이며, 새 명세와도 맞지 않는다.
- 기대 효과: 홈 진입점이 더 명확해지고 핵심 액션 위계가 살아난다.
- 시작 파일:
  - `src/pages/HomePage.tsx`
  - `src/components/layout/AppHeader.tsx`

완료 조건:

- 검색창 제거
- `약 검색`, `분석` 핵심 액션 강조
- 랜딩 섹션 추가
- 처방전 촬영은 내부 보조 기능으로만 노출

## P1

### 5. 결과 화면 우선순위 재설계

- 문제: 가장 위험한 결과와 후속 행동이 충분히 강조되지 않음
- 시작 파일:
  - `src/pages/ResultsPage.tsx`
  - `src/components/common/RiskBadge.tsx`

완료 조건:

- `금기` 결과 우선 노출
- 요약 영역에서 즉시 행동 유도

### 6. 공통 상태 컴포넌트 도입

- 문제: Empty/Loading/Error/Success 패턴이 분산
- 시작 파일:
  - `src/pages/OcrPage.tsx`
  - `src/pages/SharePage.tsx`
  - `src/pages/ResultsPage.tsx`
  - `src/components/common/`

완료 조건:

- 최소 2개 이상 페이지에서 재사용
- 문구 톤과 시각 밀도 통일

### 7. 색/토큰 일관화

- 문제: 각 화면이 직접 색을 지정
- 시작 파일:
  - `src/styles/theme.css`
  - `src/styles/globals.css`
  - `src/components/common/RiskBadge.tsx`
  - `src/components/common/Chip.tsx`

완료 조건:

- 의미 기반 토큰으로 주요 컴포넌트 치환
- 위험도/기능색 분리

## P2

### 8. OCR 결과 수정 UX

- 시작 파일:
  - `src/pages/OcrPage.tsx`

완료 조건:

- 저신뢰 항목 수정 가능
- 촬영 가이드 추가

### 9. 공유 화면 실사용성 개선

- 시작 파일:
  - `src/pages/SharePage.tsx`

완료 조건:

- `alert()` 제거
- 미구현 기능 처리 정책 반영
- 공유 결과에 분석 항목 이름 노출

## 작업시 주의

- 이 앱은 의료 안전 정보를 다루므로 "예쁘게 보이기"보다 "즉시 이해되는가"가 우선이다.
- 위험도 색은 브랜딩이 아니라 정보 전달 도구로 취급해야 한다.
- 모바일에서 한 손 사용, 고령층 가독성, 데이터 해석 피로도를 항상 우선 검토할 것.
