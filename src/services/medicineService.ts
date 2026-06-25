import type { Medicine } from '@/types';
import { apiFetch } from './api';

interface ApiIngredient {
  ingredientId: string;
  nameKo: string;
  nameEn: string | null;
  amount: number | null;
  unit: string | null;
}

interface ApiMedicineProduct {
  productId: string;
  productName: string;
  manufacturer: string | null;
  ingredients: ApiIngredient[];
}

interface ApiSearchResponse {
  results: ApiMedicineProduct[];
}

function toMedicine(p: ApiMedicineProduct): Medicine {
  return {
    id: p.productId,
    productName: p.productName,
    manufacturer: p.manufacturer ?? '',
    dosageForm: '',
    classification: '',
    ingredients: p.ingredients.map((ing, i) => ({
      ingredient: {
        id: ing.ingredientId,
        nameKo: ing.nameKo,
        nameEn: ing.nameEn ?? '',
        category: '',
      },
      amount: ing.amount ?? 0,
      unit: ing.unit ?? '',
      isMain: i === 0,
    })),
  };
}

export async function searchMedicines(query: string): Promise<Medicine[]> {
  if (!query.trim()) return [];
  const data = await apiFetch<ApiSearchResponse>(
    `/medicines/search?keyword=${encodeURIComponent(query.trim())}`,
  );
  return data.results.map(toMedicine);
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  const data = await apiFetch<ApiSearchResponse>(
    `/medicines/search?keyword=${encodeURIComponent(id)}`,
  );
  const match = data.results.find((p) => p.productId === id);
  return match ? toMedicine(match) : null;
}
