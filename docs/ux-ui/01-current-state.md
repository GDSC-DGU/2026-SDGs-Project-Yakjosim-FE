# Current State

## 제품 목적

- 사용자가 약, 음식, 영양제 조합의 상호작용을 빠르게 확인하는 모바일 중심 앱
- 목표 플로우는 `온보딩 -> 기본 정보 입력 -> 홈 또는 바로 분석 -> 약 검색/조합 입력 -> 결과 -> 상세/공유`

## 현재 라우트

- `/`: 온보딩
- `/home`: 홈
- `/search`: 약 검색
- `/combine`: 조합 선택
- `/results`: 분석 결과
- `/detail/:resultId`: 결과 상세
- `/share/:sessionId`: 결과 공유
- `/settings`: 설정

참고 파일: `src/App.tsx`

## 현재 구조의 강점

- 화면 흐름이 단순해서 사용자가 주요 기능까지 도달하는 경로가 짧다.
- `PageContainer`, `SectionCard`, `RiskBadge` 등 공통 UI 단위가 이미 있다.
- 분석 결과와 상세 정보가 분리되어 있어 정보 확장 구조를 만들기 쉽다.
- 검색, 조합 입력, 결과 화면이 이미 있어 비회원 MVP 재정렬이 가능하다.

## 현재 구조의 핵심 문제

### 1. 공통 레이아웃 규칙이 느슨함

- `PageContainer`가 하단 네비 공간만 일부 보정한다.
- 개별 페이지는 별도로 `pb-24`, `fixed bottom-0`, `bottom-20` 등을 섞어 쓰고 있다.
- 결과적으로 CTA가 하단 네비와 겹치거나 본문 마지막 카드가 CTA 아래로 숨을 가능성이 있다.

관련 파일:

- `src/components/layout/PageContainer.tsx`
- `src/pages/SearchPage.tsx`
- `src/pages/CombinationPage.tsx`

### 2. 시각 언어가 분산됨

- `theme.css`, `globals.css`에 토큰이 있지만 실제 컴포넌트는 `gray-*`, `blue-*`, `green-*`, `purple-*` 유틸리티를 직접 사용한다.
- 위험도, 기능 액션, 음식/영양제 칩이 서로 다른 기준으로 색을 쓴다.
- 의료 안전 제품답게 명확한 의미 체계를 가져가야 하는데 현재는 장식적 색 사용이 먼저 보인다.

관련 파일:

- `src/styles/theme.css`
- `src/styles/globals.css`
- `src/components/common/RiskBadge.tsx`
- `src/components/common/Chip.tsx`
- `src/pages/HomePage.tsx`

### 3. 접근성 기능이 상태로만 존재함

- `seniorMode` 상태는 존재한다.
- 실제 CSS는 `:root[data-senior="true"]`를 기대한다.
- 루트 엘리먼트에 해당 속성을 붙이는 코드가 없다.
- 즉 설정 화면의 토글은 보이지만 사용자 관점에서는 효과가 없다.

관련 파일:

- `src/contexts/UserContext.tsx`
- `src/styles/globals.css`
- `src/pages/SettingsPage.tsx`
- `src/main.tsx`

### 4. 상태 UX가 페이지마다 따로 논다

- 빈 상태 메시지는 대부분 텍스트 한 줄이다.
- 로딩 상태는 `OcrPage`, `SearchInput`, `CombinationPage`가 각자 다른 톤을 가진다.
- 성공 상태도 저장 완료, 복사 완료 등을 `alert()` 또는 버튼 텍스트 변경으로만 처리한다.

관련 파일:

- `src/pages/OcrPage.tsx`
- `src/pages/ResultsPage.tsx`
- `src/pages/SharePage.tsx`
- `src/components/common/SearchInput.tsx`

### 5. 조작 가능한 영역의 affordance가 약한 곳이 있음

- 카드 전체 클릭과 내부 삭제 버튼이 함께 있는 패턴이 섞여 있다.
- 홈 검색창은 `div` 클릭으로 이동하지만 실제로는 입력 필드처럼 보인다.
- 검색 결과 드롭다운은 키보드 탐색 규칙이 없다.

관련 파일:

- `src/pages/HomePage.tsx`
- `src/components/common/SearchInput.tsx`
- `src/components/common/MedicineCard.tsx`

## 현재 명세 기준으로 우선 정리할 점

- 홈 화면은 검색창 없이 `약 검색`, `분석` 중심 랜딩형 구조로 바꿔야 한다.
- `처방전 인식`은 독립 메인 진입점이 아니라 검색/분석 내부 보조 기능으로 내려가야 한다.
- 마이페이지, 저장 기록, 회원 전제 UX는 이번 MVP 범위에서 제거해야 한다.
- 결과 위험도는 `금기`, `주의`, `확인 정보 없음` 3단계 기준으로 재정렬해야 한다.
