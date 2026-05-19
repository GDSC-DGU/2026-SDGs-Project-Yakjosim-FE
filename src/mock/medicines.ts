import type { Medicine, ActiveIngredient } from '@/types';

// ── 성분 정의 ──
export const ingredients: ActiveIngredient[] = [
  { id: 'ing-001', nameKo: '아세트아미노펜', nameEn: 'Acetaminophen', category: '해열진통제' },
  { id: 'ing-002', nameKo: '아세틸살리실산', nameEn: 'Acetylsalicylic acid', category: '해열진통소염제' },
  { id: 'ing-003', nameKo: '암로디핀', nameEn: 'Amlodipine', category: '칼슘채널차단제' },
  { id: 'ing-004', nameKo: '아토르바스타틴', nameEn: 'Atorvastatin', category: '스타틴' },
  { id: 'ing-005', nameKo: '레보티록신', nameEn: 'Levothyroxine', category: '갑상선호르몬' },
  { id: 'ing-006', nameKo: '와파린', nameEn: 'Warfarin', category: '항응고제' },
  { id: 'ing-007', nameKo: '메트포르민', nameEn: 'Metformin', category: '경구혈당강하제' },
  { id: 'ing-008', nameKo: '오메프라졸', nameEn: 'Omeprazole', category: '프로톤펌프억제제' },
  { id: 'ing-009', nameKo: '셀레콕시브', nameEn: 'Celecoxib', category: 'COX-2 선택적 억제제' },
  { id: 'ing-010', nameKo: '알프라졸람', nameEn: 'Alprazolam', category: '벤조디아제핀' },
  { id: 'ing-011', nameKo: '아목시실린', nameEn: 'Amoxicillin', category: '페니실린계 항생제' },
  { id: 'ing-012', nameKo: '로사르탄', nameEn: 'Losartan', category: 'ARB 항고혈압제' },
];

export const medicines: Medicine[] = [
  {
    id: 'med-001',
    productName: '타이레놀정 500mg',
    manufacturer: '한국존슨앤드존슨',
    dosageForm: '정제',
    classification: '일반의약품',
    ingredients: [
      { ingredient: ingredients[0], amount: 500, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-002',
    productName: '아스피린정 100mg',
    manufacturer: '바이엘코리아',
    dosageForm: '정제',
    classification: '일반의약품',
    ingredients: [
      { ingredient: ingredients[1], amount: 100, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-003',
    productName: '노르바스크정 5mg',
    manufacturer: '한국화이자',
    dosageForm: '정제',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[2], amount: 5, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-004',
    productName: '리피토정 20mg',
    manufacturer: '한국화이자',
    dosageForm: '정제',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[3], amount: 20, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-005',
    productName: '신지로이드정 0.1mg',
    manufacturer: '부광약품',
    dosageForm: '정제',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[4], amount: 0.1, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-006',
    productName: '와파린정 2mg',
    manufacturer: '유한양행',
    dosageForm: '정제',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[5], amount: 2, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-007',
    productName: '메트포르민정 500mg',
    manufacturer: '대웅제약',
    dosageForm: '정제',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[6], amount: 500, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-008',
    productName: '오메프라졸캡슐 20mg',
    manufacturer: '한미약품',
    dosageForm: '캡슐',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[7], amount: 20, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-009',
    productName: '세레콕시브캡슐 200mg',
    manufacturer: '한국화이자',
    dosageForm: '캡슐',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[8], amount: 200, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-010',
    productName: '자낙스정 0.25mg',
    manufacturer: '한국화이자',
    dosageForm: '정제',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[9], amount: 0.25, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-011',
    productName: '아목시실린캡슐 500mg',
    manufacturer: '종근당',
    dosageForm: '캡슐',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[10], amount: 500, unit: 'mg', isMain: true },
    ],
  },
  {
    id: 'med-012',
    productName: '로사르탄정 50mg',
    manufacturer: 'MSD코리아',
    dosageForm: '정제',
    classification: '전문의약품',
    ingredients: [
      { ingredient: ingredients[11], amount: 50, unit: 'mg', isMain: true },
    ],
  },
];
