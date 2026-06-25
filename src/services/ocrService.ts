import type { Medicine } from '@/types';
import { apiUpload } from './api';
import { searchMedicines } from './medicineService';

interface ApiOCRItem {
  rawText: string;
  candidateProducts: Array<{
    productId?: string;
    productName?: string;
    score?: number;
  }>;
  requiresUserConfirmation: boolean;
}

interface ApiOCRResponse {
  documentId: string;
  ocrConfidence: number;
  extractedItems: ApiOCRItem[];
}

export interface OcrResult {
  medicine: Medicine;
  confidence: number;
}

export async function uploadPrescription(file: File): Promise<OcrResult[]> {
  const formData = new FormData();
  formData.append('file', file);

  const data = await apiUpload<ApiOCRResponse>('/ocr/prescription', formData);

  const results: OcrResult[] = [];

  for (const item of data.extractedItems) {
    if (item.candidateProducts.length > 0) {
      const candidate = item.candidateProducts[0];
      if (candidate.productName) {
        const medicines = await searchMedicines(candidate.productName);
        if (medicines.length > 0) {
          results.push({
            medicine: medicines[0],
            confidence: candidate.score ?? data.ocrConfidence,
          });
        }
      }
    } else if (item.rawText) {
      const medicines = await searchMedicines(item.rawText);
      if (medicines.length > 0) {
        results.push({
          medicine: medicines[0],
          confidence: data.ocrConfidence * 0.8,
        });
      }
    }
  }

  return results;
}
