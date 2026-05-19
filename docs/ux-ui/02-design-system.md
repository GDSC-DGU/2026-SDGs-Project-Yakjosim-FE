# Design System

## 1. 토큰 정리 기준

현재는 프로젝트 토큰과 Tailwind 유틸리티가 혼용된다. 다음 원칙으로 정리하는 것을 권장한다.

- 의미 기반 토큰 우선: `primary`, `muted`, `destructive`, `risk-*`
- 화면 내 역할 기반 토큰 분리: `surface`, `surface-subtle`, `border-strong`, `text-secondary`
- 위험도와 기능성 색을 분리: 위험도 색은 의료 안전 의미 전달용으로만 사용

권장 대상 파일:

- `src/styles/theme.css`
- `src/styles/globals.css`
- `src/components/common/RiskBadge.tsx`
- `src/components/common/Chip.tsx`

## 2. 레이아웃 규칙

### 페이지 셸

- 상단 헤더 높이, 본문 최대 너비, 하단 네비 높이, 고정 CTA 높이를 상수처럼 관리해야 한다.
- 현재 `PageContainer`는 하단 네비 보정만 한다.
- `showBottomNav`와 별개로 `showBottomCTA` 또는 `bottomInset` 개념을 추가하는 편이 낫다.

권장 개선:

- `PageContainer`에 하단 inset 규칙 추가
- 각 페이지의 `fixed` CTA 제거 또는 공통 `BottomActionBar` 컴포넌트로 치환
- 모바일 기준 본문 최대 폭과 수평 패딩 규칙 통일

### 카드 간격

- 현재 카드 패딩은 `p-3`, `p-4`, `p-5`가 혼재한다.
- 정보 카드 밀도가 높은 제품이므로 레벨별 간격 규칙이 필요하다.

권장 규칙 예시:

- 요약 카드: `p-5`
- 일반 리스트 카드: `p-4`
- 밀집형 아이템 카드: `p-3`
- 섹션 간 간격: `space-y-6`
- 섹션 내부 요소 간격: `space-y-3` 또는 `space-y-4`

## 3. 타이포그래피

현재 `theme.css`에서 `h1-h4`, `label`, `button`, `input` 기본 타이포는 있으나 실제 페이지는 `text-*` 클래스를 직접 많이 쓴다.

권장 사항:

- 페이지 제목, 섹션 제목, 카드 제목, 보조 설명의 타입 스케일 정의
- "경고", "주의", "설명", "근거" 같은 정보 계층마다 텍스트 스타일을 고정
- 장문 설명에는 `leading-relaxed`를 기본값으로 적용

## 4. 상태 시스템

공통 상태 컴포넌트를 만드는 편이 다음 유지보수에 유리하다.

필요 상태:

- EmptyState
- LoadingState
- ErrorState
- SuccessToast or InlineFeedback

현재 문제:

- 빈 상태는 텍스트 한 줄이 많다.
- 성공 피드백은 `alert()`와 버튼 텍스트 변경이 섞여 있다.
- 검색, OCR, 분석 진행 표시 방식이 다르다.

권장 대상 파일:

- `src/pages/OcrPage.tsx`
- `src/pages/SharePage.tsx`
- `src/pages/ResultsPage.tsx`
- `src/components/common/SearchInput.tsx`

## 5. 접근성

### 반드시 처리할 것

- `seniorMode`를 루트 DOM과 연결
- 클릭 가능한 카드에 키보드 접근성 부여
- 검색 자동완성에 `role`, `aria-expanded`, `aria-activedescendant` 또는 최소한의 키보드 탐색 추가
- 색만으로 위험도를 전달하지 않도록 배지 라벨/아이콘 유지

### 추가 권장

- 헤더 뒤로가기 버튼 hit area 44px 이상 유지
- 하단 내비 현재 탭에 `aria-current="page"` 부여
- 다이얼로그 첫 포커스/닫힘 후 포커스 복귀 확인

## 6. 컴포넌트별 메모

### `RiskBadge`

- 색상 정의가 컴포넌트 내부 하드코딩이다.
- `risk-*` 토큰을 실제로 소비하도록 옮기는 것이 좋다.
- `critical`, `high`, `medium`, `low`, `unknown`의 문구 길이가 달라 레이아웃 흔들림이 있다.

### `Chip`

- 음식/영양제 구분을 보라/초록으로만 표현한다.
- 선택 상태 강조 대비는 괜찮지만 비선택 상태가 약하다.
- 많은 칩이 렌더링될 때 스캔성이 떨어진다.

### `SearchInput`

- 클릭/포커스/검색중/결과없음/선택완료 상태를 분리해 정의하는 것이 좋다.
- 현재는 "결과 없음" 상태가 없다.
- 모바일 키보드가 열린 상태에서 드롭다운 겹침을 검토해야 한다.
