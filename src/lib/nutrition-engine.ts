/**
 * Nutrition Calculation Engine
 * Pure functions for computing macros, P:E ratios, and substitution deltas.
 * Runs both at build time and client-side runtime.
 */

export interface NutrientProfile {
  calories: number;
  protein: number;
  totalFat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbs: number;
  dietaryFiber: number;
  totalSugars: number;
  iron: number;
  calcium: number;
  potassium: number;
  vitaminD: number;
}

export interface IngredientNutrition {
  id: string;
  name: string;
  macrosPer100g: NutrientProfile;
  category: 'dry' | 'wet' | 'protein' | 'produce' | 'seasoning';
  hydrationFactor: number;
  amountRatio: number;
}

export interface RecipeIngredient {
  id: string;
  originalId: string;
  name: string;
  amountG: number;
  displayUS: string;
  displayMetric: string;
  category: 'dry' | 'wet';
  isSwappable: boolean;
  substitutionGroupId?: string;
  isSwapped?: boolean;
}

const ZERO_NUTRIENTS: NutrientProfile = {
  calories: 0, protein: 0, totalFat: 0, saturatedFat: 0,
  cholesterol: 0, sodium: 0, totalCarbs: 0, dietaryFiber: 0,
  totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0,
};

/** Calculate nutrients for a single ingredient at a given weight */
export function calculateIngredientNutrients(
  macrosPer100g: NutrientProfile,
  amountG: number
): NutrientProfile {
  const factor = amountG / 100;
  return {
    calories: Math.round(macrosPer100g.calories * factor),
    protein: Math.round(macrosPer100g.protein * factor * 10) / 10,
    totalFat: Math.round(macrosPer100g.totalFat * factor * 10) / 10,
    saturatedFat: Math.round(macrosPer100g.saturatedFat * factor * 10) / 10,
    cholesterol: Math.round(macrosPer100g.cholesterol * factor),
    sodium: Math.round(macrosPer100g.sodium * factor),
    totalCarbs: Math.round(macrosPer100g.totalCarbs * factor * 10) / 10,
    dietaryFiber: Math.round(macrosPer100g.dietaryFiber * factor * 10) / 10,
    totalSugars: Math.round(macrosPer100g.totalSugars * factor * 10) / 10,
    iron: Math.round(macrosPer100g.iron * factor * 10) / 10,
    calcium: Math.round(macrosPer100g.calcium * factor),
    potassium: Math.round(macrosPer100g.potassium * factor),
    vitaminD: Math.round(macrosPer100g.vitaminD * factor * 10) / 10,
  };
}

/** Sum nutrient profiles */
export function sumNutrients(profiles: NutrientProfile[]): NutrientProfile {
  return profiles.reduce((sum, p) => ({
    calories: sum.calories + p.calories,
    protein: Math.round((sum.protein + p.protein) * 10) / 10,
    totalFat: Math.round((sum.totalFat + p.totalFat) * 10) / 10,
    saturatedFat: Math.round((sum.saturatedFat + p.saturatedFat) * 10) / 10,
    cholesterol: sum.cholesterol + p.cholesterol,
    sodium: sum.sodium + p.sodium,
    totalCarbs: Math.round((sum.totalCarbs + p.totalCarbs) * 10) / 10,
    dietaryFiber: Math.round((sum.dietaryFiber + p.dietaryFiber) * 10) / 10,
    totalSugars: Math.round((sum.totalSugars + p.totalSugars) * 10) / 10,
    iron: Math.round((sum.iron + p.iron) * 10) / 10,
    calcium: sum.calcium + p.calcium,
    potassium: sum.potassium + p.potassium,
    vitaminD: Math.round((sum.vitaminD + p.vitaminD) * 10) / 10,
  }), { ...ZERO_NUTRIENTS });
}

/** Divide nutrients by serving count */
export function divideNutrients(profile: NutrientProfile, servings: number): NutrientProfile {
  if (servings <= 0) return { ...ZERO_NUTRIENTS };
  return {
    calories: Math.round(profile.calories / servings),
    protein: Math.round(profile.protein / servings * 10) / 10,
    totalFat: Math.round(profile.totalFat / servings * 10) / 10,
    saturatedFat: Math.round(profile.saturatedFat / servings * 10) / 10,
    cholesterol: Math.round(profile.cholesterol / servings),
    sodium: Math.round(profile.sodium / servings),
    totalCarbs: Math.round(profile.totalCarbs / servings * 10) / 10,
    dietaryFiber: Math.round(profile.dietaryFiber / servings * 10) / 10,
    totalSugars: Math.round(profile.totalSugars / servings * 10) / 10,
    iron: Math.round(profile.iron / servings * 10) / 10,
    calcium: Math.round(profile.calcium / servings),
    potassium: Math.round(profile.potassium / servings),
    vitaminD: Math.round(profile.vitaminD / servings * 10) / 10,
  };
}

/**
 * Calculate P:E Ratio
 * Formula from proteinpercent.com: 1.5 * protein / (fat * 9/4 + carbs - fiber/2)
 */
export function calculatePERatio(nutrients: NutrientProfile): number {
  const denominator = (nutrients.totalFat * 9 / 4) + nutrients.totalCarbs - (nutrients.dietaryFiber / 2);
  const safeDenom = Math.max(denominator, 1); // Avoid division by zero
  return Math.round((1.5 * nutrients.protein / safeDenom) * 100) / 100;
}

/** Calculate macro calorie percentages */
export function calculateMacroPercentages(nutrients: NutrientProfile): {
  proteinPct: number;
  fatPct: number;
  carbPct: number;
} {
  const proteinCal = nutrients.protein * 4;
  const fatCal = nutrients.totalFat * 9;
  const carbCal = nutrients.totalCarbs * 4;
  const total = proteinCal + fatCal + carbCal;

  if (total === 0) return { proteinPct: 0, fatPct: 0, carbPct: 0 };

  return {
    proteinPct: Math.round(proteinCal / total * 100),
    fatPct: Math.round(fatCal / total * 100),
    carbPct: Math.round(carbCal / total * 100),
  };
}

/** Map P:E ratio to gauge angle (0-180 degrees) */
export function peRatioToAngle(peRatio: number): number {
  // Map 0-3+ to 0-180 degrees
  const clamped = Math.min(Math.max(peRatio, 0), 3.5);
  return (clamped / 3.5) * 180;
}

/** Get P:E rating label */
export function getPERating(peRatio: number): { label: string; color: string } {
  if (peRatio >= 2.5) return { label: 'Excellent', color: '#0a4d33' };
  if (peRatio >= 1.5) return { label: 'Good', color: '#22c55e' };
  if (peRatio >= 1.0) return { label: 'Moderate', color: '#f59e0b' };
  if (peRatio >= 0.5) return { label: 'Low', color: '#f97316' };
  return { label: 'Poor', color: '#b91c1c' };
}

/** FDA % Daily Values (based on 2000 calorie diet) */
const DAILY_VALUES: Partial<Record<keyof NutrientProfile, number>> = {
  totalFat: 78,
  saturatedFat: 20,
  cholesterol: 300,
  sodium: 2300,
  totalCarbs: 275,
  dietaryFiber: 28,
  protein: 50,
  vitaminD: 20,
  calcium: 1300,
  iron: 18,
  potassium: 4700,
};

export function getDailyValuePercent(nutrient: keyof NutrientProfile, amount: number): number | null {
  const dv = DAILY_VALUES[nutrient];
  if (!dv) return null;
  return Math.round((amount / dv) * 100);
}

/** Calculate substitution delta */
export function calculateDelta(
  oldNutrients: NutrientProfile,
  newNutrients: NutrientProfile
): NutrientProfile {
  return {
    calories: newNutrients.calories - oldNutrients.calories,
    protein: Math.round((newNutrients.protein - oldNutrients.protein) * 10) / 10,
    totalFat: Math.round((newNutrients.totalFat - oldNutrients.totalFat) * 10) / 10,
    saturatedFat: Math.round((newNutrients.saturatedFat - oldNutrients.saturatedFat) * 10) / 10,
    cholesterol: newNutrients.cholesterol - oldNutrients.cholesterol,
    sodium: newNutrients.sodium - oldNutrients.sodium,
    totalCarbs: Math.round((newNutrients.totalCarbs - oldNutrients.totalCarbs) * 10) / 10,
    dietaryFiber: Math.round((newNutrients.dietaryFiber - oldNutrients.dietaryFiber) * 10) / 10,
    totalSugars: Math.round((newNutrients.totalSugars - oldNutrients.totalSugars) * 10) / 10,
    iron: Math.round((newNutrients.iron - oldNutrients.iron) * 10) / 10,
    calcium: newNutrients.calcium - oldNutrients.calcium,
    potassium: newNutrients.potassium - oldNutrients.potassium,
    vitaminD: Math.round((newNutrients.vitaminD - oldNutrients.vitaminD) * 10) / 10,
  };
}
