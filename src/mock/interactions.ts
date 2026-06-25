import type { InteractionRule } from '@/types';

export const interactionRules: InteractionRule[] = [
  // ── 약물-약물 ──
  {
    id: 'rule-001',
    subjectType: 'drug',
    subjectId: 'med-006', // 와파린
    subjectName: '와파린정 2mg',
    objectType: 'drug',
    objectId: 'med-002', // 아스피린
    objectName: '아스피린정 100mg',
    interactionType: 'contraindication',
    severity: 'critical',
    mechanism: '두 약물 모두 혈액 응고를 억제하여 출혈 위험이 크게 증가합니다',
    recommendation: '함께 복용 전 반드시 의사와 상담하세요',
    evidenceSource: '식약처 의약품 병용금기 목록',
  },
  {
    id: 'rule-002',
    subjectType: 'drug',
    subjectId: 'med-006', // 와파린
    subjectName: '와파린정 2mg',
    objectType: 'drug',
    objectId: 'med-001', // 타이레놀
    objectName: '타이레놀정 500mg',
    interactionType: 'caution',
    severity: 'high',
    mechanism: '아세트아미노펜이 와파린의 항응고 효과를 증가시킬 수 있습니다',
    recommendation: '복용 중이라면 전문가 확인이 필요합니다',
    evidenceSource: '식약처 의약품 상호작용 정보',
  },
  {
    id: 'rule-003',
    subjectType: 'drug',
    subjectId: 'med-008', // 오메프라졸
    subjectName: '오메프라졸캡슐 20mg',
    objectType: 'drug',
    objectId: 'med-009', // 셀레콕시브
    objectName: '세레콕시브캡슐 200mg',
    interactionType: 'effect_decrease',
    severity: 'medium',
    mechanism: '동시 사용에 큰 문제는 없으나 위장 보호 효과를 확인하세요',
    recommendation: '위장 증상이 있으면 의사와 상담하세요',
    evidenceSource: '약학정보원',
  },

  // ── 약물-음식 ──
  {
    id: 'rule-004',
    subjectType: 'drug',
    subjectId: 'med-003', // 노르바스크(암로디핀)
    subjectName: '노르바스크정 5mg',
    objectType: 'food',
    objectId: '9eff584f-0a7d-4d4c-89d7-f244ee2bcc45', // 자몽
    objectName: '자몽',
    interactionType: 'effect_increase',
    severity: 'high',
    mechanism: '자몽이 약물 대사 효소(CYP3A4)를 억제하여 혈중 약물 농도가 높아질 수 있습니다',
    recommendation: '복용 중 자몽/자몽주스 섭취를 피하고 의사와 상담하세요',
    evidenceSource: '식약처 의약품 상호작용 정보',
  },
  {
    id: 'rule-005',
    subjectType: 'drug',
    subjectId: 'med-004', // 리피토(아토르바스타틴)
    subjectName: '리피토정 20mg',
    objectType: 'food',
    objectId: '9eff584f-0a7d-4d4c-89d7-f244ee2bcc45', // 자몽
    objectName: '자몽',
    interactionType: 'effect_increase',
    severity: 'high',
    mechanism: '자몽이 스타틴 계열 약물의 대사를 방해하여 부작용 위험이 증가합니다',
    recommendation: '자몽 섭취를 제한하세요. 근육통이 있으면 즉시 의사와 상담하세요',
    evidenceSource: '약학정보원',
  },
  {
    id: 'rule-006',
    subjectType: 'drug',
    subjectId: 'med-010', // 자낙스(알프라졸람)
    subjectName: '자낙스정 0.25mg',
    objectType: 'food',
    objectId: 'c3143569-03a0-4ae6-ac95-6c51a455a88e', // 알코올
    objectName: '알코올',
    interactionType: 'effect_increase',
    severity: 'critical',
    mechanism: '알코올이 벤조디아제핀의 진정 효과를 증강하여 과도한 졸음, 호흡 억제 위험이 있습니다',
    recommendation: '복용 중 음주를 절대 피하세요',
    evidenceSource: '식약처 의약품 안전 사용 정보',
  },
  {
    id: 'rule-007',
    subjectType: 'drug',
    subjectId: 'med-007', // 메트포르민
    subjectName: '메트포르민정 500mg',
    objectType: 'food',
    objectId: 'c3143569-03a0-4ae6-ac95-6c51a455a88e', // 알코올
    objectName: '알코올',
    interactionType: 'caution',
    severity: 'high',
    mechanism: '알코올이 젖산산증 위험을 증가시킬 수 있습니다',
    recommendation: '음주를 제한하고, 과음은 절대 피하세요',
    evidenceSource: '대한당뇨병학회 가이드라인',
  },
  {
    id: 'rule-008',
    subjectType: 'drug',
    subjectId: 'med-011', // 아목시실린
    subjectName: '아목시실린캡슐 500mg',
    objectType: 'food',
    objectId: '1225684c-55bd-4ee3-8cff-6e37d4e95529', // 우유
    objectName: '우유',
    interactionType: 'absorption_decrease',
    severity: 'low',
    mechanism: '일부 항생제는 유제품과 함께 복용 시 흡수가 약간 감소할 수 있으나 아목시실린은 영향이 적습니다',
    recommendation: '복용 습관을 확인하세요',
    evidenceSource: '약학정보원',
  },
  {
    id: 'rule-009',
    subjectType: 'drug',
    subjectId: 'med-006', // 와파린
    subjectName: '와파린정 2mg',
    objectType: 'food',
    objectId: '34a5c48f-813e-4b9d-a722-a4adb151b026', // 시금치
    objectName: '시금치',
    interactionType: 'effect_decrease',
    severity: 'medium',
    mechanism: '비타민K가 풍부한 음식은 와파린의 항응고 효과를 감소시킬 수 있습니다',
    recommendation: '비타민K 섭취량을 일정하게 유지하고 급격한 변화를 피하세요',
    evidenceSource: '식약처 의약품 안전 사용 정보',
  },
  {
    id: 'rule-010',
    subjectType: 'drug',
    subjectId: 'med-005', // 신지로이드(레보티록신)
    subjectName: '신지로이드정 0.1mg',
    objectType: 'food',
    objectId: '67a9265a-9425-4ccc-861e-9af841ba5911', // 커피
    objectName: '커피',
    interactionType: 'absorption_decrease',
    severity: 'medium',
    mechanism: '카페인이 갑상선 호르몬의 흡수를 방해할 수 있습니다',
    recommendation: '약 복용 후 최소 30분~1시간 후에 커피를 드세요',
    minIntervalHours: 1,
    evidenceSource: '대한갑상선학회',
  },

  // ── 약물-영양제 ──
  {
    id: 'rule-011',
    subjectType: 'drug',
    subjectId: 'med-005', // 신지로이드(레보티록신)
    subjectName: '신지로이드정 0.1mg',
    objectType: 'supplement',
    objectId: '283f9d20-ba5a-452f-a7ee-8cd801220c2a', // 칼슘
    objectName: '칼슘',
    interactionType: 'absorption_decrease',
    severity: 'medium',
    mechanism: '칼슘이 갑상선 호르몬의 장내 흡수를 방해합니다',
    recommendation: '최소 4시간 간격을 두고 복용하세요',
    minIntervalHours: 4,
    evidenceSource: '대한갑상선학회',
  },
  {
    id: 'rule-012',
    subjectType: 'drug',
    subjectId: 'med-005', // 신지로이드(레보티록신)
    subjectName: '신지로이드정 0.1mg',
    objectType: 'supplement',
    objectId: '55fa2d9a-c1c0-4692-8473-e29b39317184', // 철분
    objectName: '철분',
    interactionType: 'absorption_decrease',
    severity: 'medium',
    mechanism: '철분이 갑상선 호르몬과 결합하여 흡수를 저하시킵니다',
    recommendation: '최소 4시간 간격을 두고 복용하세요',
    minIntervalHours: 4,
    evidenceSource: '대한갑상선학회',
  },
  {
    id: 'rule-013',
    subjectType: 'drug',
    subjectId: 'med-006', // 와파린
    subjectName: '와파린정 2mg',
    objectType: 'supplement',
    objectId: '75eb6123-45ec-40fa-b4c2-a74626c59acc', // 비타민K
    objectName: '비타민K',
    interactionType: 'effect_decrease',
    severity: 'high',
    mechanism: '비타민K가 와파린의 항응고 작용을 직접적으로 감소시킵니다',
    recommendation: '비타민K 보충제 복용 전 반드시 의사와 상담하세요',
    evidenceSource: '식약처 의약품 안전 사용 정보',
  },
  {
    id: 'rule-014',
    subjectType: 'drug',
    subjectId: 'med-006', // 와파린
    subjectName: '와파린정 2mg',
    objectType: 'supplement',
    objectId: 'e995986f-b776-4784-84da-6dd89a952b65', // 오메가3
    objectName: '오메가3',
    interactionType: 'effect_increase',
    severity: 'medium',
    mechanism: '오메가3가 혈소판 응집을 억제하여 출혈 위험을 높일 수 있습니다',
    recommendation: '고용량 오메가3 복용 시 의사에게 알리세요',
    evidenceSource: '약학정보원',
  },
  {
    id: 'rule-015',
    subjectType: 'drug',
    subjectId: 'med-002', // 아스피린
    subjectName: '아스피린정 100mg',
    objectType: 'supplement',
    objectId: 'e995986f-b776-4784-84da-6dd89a952b65', // 오메가3
    objectName: '오메가3',
    interactionType: 'caution',
    severity: 'medium',
    mechanism: '둘 다 혈소판 기능을 억제하여 출혈 경향이 증가할 수 있습니다',
    recommendation: '수술 전 복용 여부를 의사에게 알리세요',
    evidenceSource: '대한약사회',
  },
  {
    id: 'rule-016',
    subjectType: 'drug',
    subjectId: 'med-007', // 메트포르민
    subjectName: '메트포르민정 500mg',
    objectType: 'supplement',
    objectId: 'fc0616c6-283f-4cb0-83ef-b822fb8fdca1', // 비타민C
    objectName: '비타민C',
    interactionType: 'caution',
    severity: 'low',
    mechanism: '비타민C가 메트포르민의 흡수에 미치는 영향은 미미합니다',
    recommendation: '일반적인 용량에서는 큰 문제없으나 고용량은 주의하세요',
    evidenceSource: '약학정보원',
  },
];
