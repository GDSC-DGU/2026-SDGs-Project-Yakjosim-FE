# 약 조심 — 프론트엔드 인수인계

## 프로젝트 개요

약, 음식, 영양제 조합의 상호작용 위험도를 안내하는 모바일 웹앱.  
현재 **비회원(게스트) 전용 MVP** 상태로, 모든 데이터는 mock으로 동작한다.

**기술 스택:** React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7  
**패키지 매니저:** pnpm 11.1.3 (`packageManager` 필드로 고정)

---

## 페이지 구조

| 경로 | 파일 | 설명 |
|------|------|------|
| `/` | `OnboardingGuard` | 온보딩 완료 여부 체크 → 완료 시 `/home` 리다이렉트 |
| `/` (미완료) | `OnboardingPage` | 약관 동의 + 사용자 프로필 입력 |
| `/home` | `HomePage` | 서비스 소개, 분석 시작 진입점 |
| `/search` | `SearchPage` | 약 검색 + 상세 정보 조회 |
| `/ocr` | `OcrPage` | 처방전 촬영 → 약 인식 |
| `/add-medicine` | `AddMedicinePage` | 검색 결과에서 분석 목록에 약 추가 |
| `/combine` | `CombinationPage` | 약/음식/영양제 조합 선택 + 분석 실행 |
| `/results` | `ResultsPage` | 분석 결과 목록 (위험도 필터, 이미지/PDF 저장) |
| `/detail/:resultId` | `DetailPage` | 개별 상호작용 상세 정보 |
| `/share/:sessionId` | `SharePage` | 결과 공유 화면 |
| `/settings` | `SettingsPage` | 고령층 모드 토글, 데이터 초기화 |

**하단 네비게이션:** 홈 / 검색 / 분석 / 설정 (4개 탭)

---

## 현재 mock 구조

실제 API가 없고, 아래 두 곳에서 데이터를 가져온다.

```
src/mock/
├── medicines.ts       # 약 목록 + 성분 (하드코딩 ~16개)
├── foods.ts           # 음식 목록 (하드코딩 ~20개)
├── supplements.ts     # 영양제 성분 목록 (하드코딩)
├── interactions.ts    # 상호작용 룰 (하드코딩)
└── index.ts

src/services/
├── medicineService.ts  # 약 검색 · 조회 → mock 참조
├── ocrService.ts       # OCR → 항상 고정된 3개 약 반환
└── analysisService.ts  # 상호작용 분석 → mock 룰 매칭
```

**서비스 레이어는 이미 `async function`으로 분리돼 있어서, 각 파일 내부만 교체하면 된다. 페이지 코드는 건드릴 필요 없음.**

단, **음식·영양제**는 아직 서비스 레이어가 없고 `CombinationPage`에서 mock을 직접 import한다. API 연동 시 서비스 레이어 추가가 필요하다.

---

## API 연동 가이드

### 1. 사용자 프로필 저장 (온보딩)

**파일:** `src/contexts/UserContext.tsx`  
**현재 동작:** localStorage(`yak-josim-user-state`)에만 저장, 백엔드 전송 없음.

온보딩 완료 시 `dispatch({ type: 'SET_PROFILE', payload })` 호출.  
이 시점에 백엔드로 프로필을 전송하거나 세션을 생성하면 된다.

**전송할 데이터:**

```ts
interface UserProfile {
  birthDate?: string;       // 'YYYY-MM-DD'
  birthYear?: number;
  sex?: 'male' | 'female' | 'other';
  isPregnant: boolean;
  isElderly: boolean;       // birthDate 기준 65세 이상이면 자동 true
  chronicConditions: string[]; // ['고혈압', '당뇨'] 등, '없음' 포함 가능
}
```

**주의:** 현재 `chronicConditions`, `isPregnant` 등 프로필 정보가 분석 API에 전달되지 않는다. 개인화 분석을 하려면 `analyzeInteractions()` 호출 시 프로필도 함께 넘겨야 한다.

---

### 2. 약 검색

**파일:** `src/services/medicineService.ts`  
**교체할 함수 3개:**

```ts
// 약품명 · 제조사 · 성분명 검색
async function searchMedicines(query: string): Promise<Medicine[]>

// ID로 단일 약 조회
async function getMedicineById(id: string): Promise<Medicine | null>

// 전체 성분 목록 (드롭다운 등에 활용)
async function getIngredients(): Promise<ActiveIngredient[]>
```

**반환 타입:**

```ts
interface Medicine {
  id: string;
  productName: string;
  manufacturer: string;
  dosageForm: string;        // '정제', '캡슐' 등
  classification: string;   // '전문의약품', '일반의약품' 등
  ingredients: MedicineIngredient[];
  indication?: string;       // 주요 용도 (optional)
}

interface MedicineIngredient {
  ingredient: ActiveIngredient;
  amount: number;
  unit: string;              // 'mg', 'mcg' 등
  isMain: boolean;
}

interface ActiveIngredient {
  id: string;
  nameKo: string;
  nameEn: string;
  category: string;
}
```

**연동 대상 API 후보:** 식품의약품안전처 DUR, e약은요, 약학정보원

---

### 3. OCR (처방전 촬영)

**파일:** `src/services/ocrService.ts`  
**교체할 함수:**

```ts
async function uploadPrescription(file: File): Promise<OcrResult[]>

interface OcrResult {
  medicine: Medicine;   // 인식된 약 정보 (위 Medicine 타입)
  confidence: number;   // 0.0 ~ 1.0
}
```

현재는 무조건 고정된 3개 약을 반환한다. 실제 구현 시 이미지를 서버에 업로드하거나 외부 OCR API(Google Vision, Azure, Naver Clova 등)를 사용하면 된다.

OCR 결과는 `SearchPage`로 `navigate('/search', { state: { recognizedMedicines } })`로 전달된다. 타입만 맞으면 UI는 그대로 동작한다.

---

### 4. 음식 목록

**파일:** `src/mock/foods.ts` → **서비스 레이어 신규 작성 필요**  
현재 `CombinationPage`에서 직접 import:

```ts
import { foods } from '@/mock/foods';
```

API 연동 시:
1. `src/services/foodService.ts` 신규 생성
2. `CombinationPage`에서 `useEffect`로 목록 fetch
3. 또는 검색 기반으로 전환

**타입:**

```ts
interface FoodItem {
  id: string;
  name: string;
  group: string;          // '자몽류', '유제품' 등 카테고리
  aliases: string[];      // 검색용 별칭 ('자몽주스', '그레이프프루트' 등)
}
```

---

### 5. 영양제 목록

**파일:** `src/mock/supplements.ts` → **서비스 레이어 신규 작성 필요**  
음식과 동일한 구조. 현재 `CombinationPage`에서 직접 import.

**타입:**

```ts
interface SupplementIngredient {
  id: string;
  nameKo: string;
  nameEn: string;
  category: string;       // '미네랄', '비타민' 등
  aliases: string[];
}
```

---

### 6. 상호작용 분석 (핵심)

**파일:** `src/services/analysisService.ts`  
**교체할 함수:**

```ts
async function analyzeInteractions(items: AnalysisItem[]): Promise<AnalysisSession>
```

**요청 데이터:**

```ts
interface AnalysisItem {
  id: string;         // 화면 내 고유 ID
  type: 'drug' | 'food' | 'supplement';
  name: string;
  originalId: string; // 약/음식/영양제 DB의 원본 ID
}
```

**응답 데이터:**

```ts
interface AnalysisSession {
  id: string;
  items: AnalysisItem[];
  results: AnalysisResult[];
  overallSeverity: Severity;  // 결과 중 가장 높은 위험도
  createdAt: Date;
}

interface AnalysisResult {
  id: string;
  rule: InteractionRule;
  severity: Severity;         // 'critical' | 'high' | 'medium' | 'low' | 'unknown'
  summary: string;
  explanation: string;        // 위험 이유 (상세 화면에 표시)
  recommendation: string;     // 권고 사항
}

interface InteractionRule {
  id: string;
  subjectType: 'drug' | 'food' | 'supplement';
  subjectId: string;
  subjectName: string;
  objectType: 'drug' | 'food' | 'supplement';
  objectId: string;
  objectName: string;
  interactionType: 'contraindication' | 'caution' | 'absorption_decrease'
                 | 'effect_increase' | 'effect_decrease' | 'duplicate';
  severity: Severity;
  mechanism: string;          // 상호작용 메커니즘 설명
  recommendation: string;
  minIntervalHours?: number;  // 복용 간격 권고 (있을 경우)
  evidenceSource: string;     // 출처 (예: '식품의약품안전처 DUR')
  evidenceUrl?: string;
}
```

**위험도 표시 매핑** (`src/utils/risk.ts`에 정의):

| severity | 화면 표시 | 배지 색상 |
|----------|-----------|-----------|
| `critical` | 금기 | 빨강 |
| `high` | 주의 | 주황 |
| `medium` | 주의 | 주황 (`high`와 동일하게 표시) |
| `low` | 주의 | 주황 |
| `unknown` | 정보 없음 | 회색 |

---

### 7. 분석 세션 조회

**파일:** `src/services/analysisService.ts`  
현재 `getSessionResults()`는 항상 `null` 반환.  
분석 결과는 React Context(`AnalysisContext`)에만 저장되므로, 새로고침하면 사라진다.

백엔드 세션 저장이 추가되면 이 함수를 교체해서 `/share/:sessionId` 등에서 서버에서 결과를 가져올 수 있다.

```ts
async function getSessionResults(sessionId: string): Promise<AnalysisSession | null>
```

---

## 기타 참고사항

- **고령층 모드:** 설정에서 토글 가능. `:root[data-senior="true"]` CSS로 전체 폰트/터치 영역 확대. 생년월일 기준 65세 이상이면 온보딩 완료 시 자동 활성화.
- **이미지/PDF 저장:** `src/utils/share.ts`에서 SVG 생성(이미지) + 인쇄(PDF) 처리. 외부 API 불필요.
- **상태 관리:** React Context 3개 — `UserContext`(프로필), `MedicineContext`(선택된 약), `AnalysisContext`(분석 세션). 서버 상태 라이브러리 없음.
- **사용자 데이터 로컬 저장:** `localStorage['yak-josim-user-state']` (UserContext), `localStorage['yak-josim-medicines']` (MedicineContext).
