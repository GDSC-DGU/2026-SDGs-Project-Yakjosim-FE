import type { Medicine } from '@/types';
import { medicines } from '@/mock';

const OCR_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface OcrResult {
  medicine: Medicine;
  confidence: number;
}

export async function uploadPrescription(_file: File): Promise<OcrResult[]> {
  await delay(OCR_DELAY_MS);

  // mock: 미리 정의된 약품 3개를 반환 (타이레놀, 노르바스크, 오메프라졸)
  const predefinedIds = ['med-001', 'med-003', 'med-008'];
  const results: OcrResult[] = predefinedIds
    .map((id) => {
      const med = medicines.find((m) => m.id === id);
      if (!med) return null;
      return {
        medicine: med,
        confidence: 0.7 + Math.random() * 0.25, // 0.7 ~ 0.95
      };
    })
    .filter((r): r is OcrResult => r !== null);

  return results;
}
