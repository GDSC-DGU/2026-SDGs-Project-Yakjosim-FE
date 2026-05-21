export type Sex = 'male' | 'female' | 'other';

export interface UserProfile {
  birthDate?: string;
  birthYear?: number;
  sex?: Sex;
  isPregnant: boolean;
  isElderly: boolean;
  chronicConditions: string[];
}
