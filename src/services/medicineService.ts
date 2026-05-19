import type { Medicine, ActiveIngredient } from '@/types';
import { medicines, ingredients } from '@/mock';

const SEARCH_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchMedicines(query: string): Promise<Medicine[]> {
  await delay(SEARCH_DELAY_MS);
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return medicines.filter(
    (m) =>
      m.productName.toLowerCase().includes(q) ||
      m.manufacturer.toLowerCase().includes(q) ||
      m.ingredients.some(
        (ing) =>
          ing.ingredient.nameKo.includes(q) ||
          ing.ingredient.nameEn.toLowerCase().includes(q),
      ),
  );
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  await delay(100);
  return medicines.find((m) => m.id === id) ?? null;
}

export async function getIngredients(): Promise<ActiveIngredient[]> {
  await delay(100);
  return ingredients;
}
