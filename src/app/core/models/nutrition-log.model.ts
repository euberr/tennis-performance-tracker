export interface NutritionPre {
  carbs: boolean;
  protein: boolean;
  caffeine: boolean;
  notes?: string;
}

export interface NutritionDuring {
  waterMl: number;
  electrolytes: boolean;
  carbs: boolean;
  notes?: string;
}

export interface NutritionPost {
  within60min: boolean;
  carbs: boolean;
  protein: boolean;
  notes?: string;
}

export interface NutritionLog {
  id: string;
  linkedType: 'match' | 'training';
  linkedId: string;
  pre: NutritionPre;
  during: NutritionDuring;
  post: NutritionPost;
  gutComfort: number; // 1-10
  cramps: number; // 1-10
  energyImpact: number; // 1-10
}
