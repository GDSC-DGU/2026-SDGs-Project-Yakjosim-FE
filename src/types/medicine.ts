export interface ActiveIngredient {
  id: string;
  nameKo: string;
  nameEn: string;
  category: string;
}

export interface MedicineIngredient {
  ingredient: ActiveIngredient;
  amount: number;
  unit: string;
  isMain: boolean;
}

export interface Medicine {
  id: string;
  productName: string;
  manufacturer: string;
  dosageForm: string;
  classification: string;
  ingredients: MedicineIngredient[];
}

export interface FoodItem {
  id: string;
  name: string;
  group: string;
  aliases: string[];
}

export interface SupplementIngredient {
  id: string;
  nameKo: string;
  nameEn: string;
  category: string;
  aliases: string[];
}
