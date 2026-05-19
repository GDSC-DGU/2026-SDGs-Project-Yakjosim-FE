# Priority Backlog

## P0

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

## P1

### 4. 결과 화면 우선순위 재설계

- 문제: 가장 위험한 결과와 후속 행동이 충분히 강조되지 않음
- 시작 파일:
  - `src/pages/ResultsPage.tsx`
  - `src/components/common/RiskBadge.tsx`

완료 조건:

- 고위험 결과 우선 노출
- 요약 영역에서 즉시 행동 유도

### 5. 공통 상태 컴포넌트 도입

- 문제: Empty/Loading/Error/Success 패턴이 분산
- 시작 파일:
  - `src/pages/OcrPage.tsx`
  - `src/pages/SharePage.tsx`
  - `src/pages/ResultsPage.tsx`
  - `src/components/common/`

완료 조건:

- 최소 2개 이상 페이지에서 재사용
- 문구 톤과 시각 밀도 통일

### 6. 색/토큰 일관화

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

### 7. OCR 결과 수정 UX

- 시작 파일:
  - `src/pages/OcrPage.tsx`

완료 조건:

- 저신뢰 항목 수정 가능
- 촬영 가이드 추가

### 8. 마이페이지 정보 구조 재편

- 시작 파일:
  - `src/pages/MyPage.tsx`

완료 조건:

- 저장 약, 분석 기록, 건강 정보의 우선순위 명확화

### 9. 공유 화면 실사용성 개선

- 시작 파일:
  - `src/pages/SharePage.tsx`

완료 조건:

- `alert()` 제거
- 미구현 기능 처리 정책 반영

## 작업시 주의

- 이 앱은 의료 안전 정보를 다루므로 "예쁘게 보이기"보다 "즉시 이해되는가"가 우선이다.
- 위험도 색은 브랜딩이 아니라 정보 전달 도구로 취급해야 한다.
- 모바일에서 한 손 사용, 고령층 가독성, 데이터 해석 피로도를 항상 우선 검토할 것.
