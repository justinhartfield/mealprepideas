/**
 * Recipe Data Module
 * Provides recipe lookup and ingredient database.
 * This will be populated from the PDF extraction pipeline.
 */

import type { NutrientProfile, RecipeIngredient } from "@/lib/nutrition-engine";

export interface Recipe {
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  dietary: { glutenFree: boolean; dairyFree: boolean; soyFree: boolean; nutFree: boolean; eggFree: boolean };
  ingredients: RecipeIngredient[];
  instructions: { title: string; text: string }[];
  notes?: string;
}

export interface IngredientEntry {
  name: string;
  macrosPer100g: NutrientProfile;
  substitutes?: string[];
}

// ============================================================================
// INGREDIENT DATABASE (USDA-based macros per 100g)
// ============================================================================

const INGREDIENT_DB: Record<string, IngredientEntry> = {
  "egg-whites": {
    name: "Liquid Egg Whites",
    macrosPer100g: { calories: 52, protein: 10.9, totalFat: 0.17, saturatedFat: 0, cholesterol: 0, sodium: 166, totalCarbs: 0.73, dietaryFiber: 0, totalSugars: 0.71, iron: 0.08, calcium: 7, potassium: 163, vitaminD: 0 },
    substitutes: ["whole-eggs", "flax-egg"],
  },
  "whole-eggs": {
    name: "Whole Eggs",
    macrosPer100g: { calories: 155, protein: 12.6, totalFat: 10.6, saturatedFat: 3.3, cholesterol: 373, sodium: 124, totalCarbs: 1.12, dietaryFiber: 0, totalSugars: 1.12, iron: 1.75, calcium: 56, potassium: 138, vitaminD: 2.0 },
  },
  "flax-egg": {
    name: "Flax Egg (1 tbsp ground + 3 tbsp water)",
    macrosPer100g: { calories: 37, protein: 1.3, totalFat: 3.0, saturatedFat: 0.3, cholesterol: 0, sodium: 2, totalCarbs: 2.0, dietaryFiber: 1.9, totalSugars: 0.1, iron: 0.4, calcium: 18, potassium: 57, vitaminD: 0 },
  },
  "gf-bread": {
    name: "Certified Gluten-Free Bread",
    macrosPer100g: { calories: 250, protein: 4.0, totalFat: 5.0, saturatedFat: 0.7, cholesterol: 0, sodium: 450, totalCarbs: 47, dietaryFiber: 3, totalSugars: 5, iron: 2.5, calcium: 100, potassium: 100, vitaminD: 0 },
    substitutes: ["rice-bread", "lettuce-wrap"],
  },
  "rice-bread": {
    name: "Rice Bread",
    macrosPer100g: { calories: 240, protein: 3.5, totalFat: 4.0, saturatedFat: 0.5, cholesterol: 0, sodium: 400, totalCarbs: 48, dietaryFiber: 1, totalSugars: 4, iron: 2.0, calcium: 80, potassium: 80, vitaminD: 0 },
  },
  "lettuce-wrap": {
    name: "Lettuce Wrap",
    macrosPer100g: { calories: 15, protein: 1.4, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 28, totalCarbs: 2.9, dietaryFiber: 1.3, totalSugars: 0.8, iron: 0.9, calcium: 36, potassium: 194, vitaminD: 0 },
  },
  "gf-oat-flour": {
    name: "Certified GF Oat Flour",
    macrosPer100g: { calories: 404, protein: 14.7, totalFat: 9.1, saturatedFat: 1.6, cholesterol: 0, sodium: 3, totalCarbs: 65.7, dietaryFiber: 6.5, totalSugars: 0.8, iron: 3.6, calcium: 55, potassium: 371, vitaminD: 0 },
    substitutes: ["rice-flour", "tigernut-flour"],
  },
  "rice-flour": {
    name: "White Rice Flour",
    macrosPer100g: { calories: 366, protein: 5.9, totalFat: 1.4, saturatedFat: 0.4, cholesterol: 0, sodium: 0, totalCarbs: 80.1, dietaryFiber: 2.4, totalSugars: 0.1, iron: 0.4, calcium: 10, potassium: 76, vitaminD: 0 },
  },
  "tigernut-flour": {
    name: "Tigernut Flour",
    macrosPer100g: { calories: 400, protein: 4.0, totalFat: 24.0, saturatedFat: 5.0, cholesterol: 0, sodium: 10, totalCarbs: 50, dietaryFiber: 25, totalSugars: 20, iron: 3.0, calcium: 30, potassium: 400, vitaminD: 0 },
  },
  "pea-protein": {
    name: "Dairy-Free Pea Protein Isolate",
    macrosPer100g: { calories: 375, protein: 80, totalFat: 3.8, saturatedFat: 0.5, cholesterol: 0, sodium: 800, totalCarbs: 3, dietaryFiber: 1, totalSugars: 0.5, iron: 10, calcium: 50, potassium: 50, vitaminD: 0 },
    substitutes: ["egg-white-protein", "hemp-protein", "rice-protein"],
  },
  "egg-white-protein": {
    name: "Egg White Protein Powder",
    macrosPer100g: { calories: 375, protein: 82, totalFat: 1.0, saturatedFat: 0, cholesterol: 0, sodium: 700, totalCarbs: 5, dietaryFiber: 0, totalSugars: 3, iron: 0.5, calcium: 40, potassium: 400, vitaminD: 0 },
  },
  "hemp-protein": {
    name: "Hemp Protein Powder",
    macrosPer100g: { calories: 333, protein: 50, totalFat: 10, saturatedFat: 1, cholesterol: 0, sodium: 0, totalCarbs: 20, dietaryFiber: 17, totalSugars: 3, iron: 13, calcium: 67, potassium: 1000, vitaminD: 0 },
  },
  "rice-protein": {
    name: "Rice Protein Powder",
    macrosPer100g: { calories: 370, protein: 76, totalFat: 3.3, saturatedFat: 0.5, cholesterol: 0, sodium: 300, totalCarbs: 7, dietaryFiber: 2, totalSugars: 0, iron: 5, calcium: 30, potassium: 200, vitaminD: 0 },
  },
  "oat-yogurt": {
    name: "Thick Unsweetened Oat Yogurt",
    macrosPer100g: { calories: 75, protein: 2.0, totalFat: 2.5, saturatedFat: 0.3, cholesterol: 0, sodium: 30, totalCarbs: 12, dietaryFiber: 1, totalSugars: 4, iron: 0.3, calcium: 120, potassium: 100, vitaminD: 0.5 },
    substitutes: ["coconut-yogurt"],
  },
  "coconut-yogurt": {
    name: "Coconut Yogurt (Unsweetened)",
    macrosPer100g: { calories: 110, protein: 1.0, totalFat: 7.0, saturatedFat: 6.0, cholesterol: 0, sodium: 15, totalCarbs: 10, dietaryFiber: 0, totalSugars: 4, iron: 0.5, calcium: 10, potassium: 80, vitaminD: 0 },
  },
  "sunflower-seed-butter": {
    name: "Sunflower Seed Butter",
    macrosPer100g: { calories: 617, protein: 17.3, totalFat: 51.5, saturatedFat: 5.2, cholesterol: 0, sodium: 2, totalCarbs: 23.3, dietaryFiber: 4.6, totalSugars: 7.5, iron: 3.8, calcium: 49, potassium: 536, vitaminD: 0 },
  },
  "oat-milk": {
    name: "Unsweetened Oat Milk",
    macrosPer100g: { calories: 40, protein: 1.0, totalFat: 1.5, saturatedFat: 0.2, cholesterol: 0, sodium: 80, totalCarbs: 7, dietaryFiber: 1, totalSugars: 3, iron: 0.3, calcium: 120, potassium: 80, vitaminD: 1.0 },
  },
  "coconut-aminos": {
    name: "Coconut Aminos",
    macrosPer100g: { calories: 100, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 3800, totalCarbs: 20, dietaryFiber: 0, totalSugars: 20, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "banana": {
    name: "Banana",
    macrosPer100g: { calories: 89, protein: 1.1, totalFat: 0.3, saturatedFat: 0.1, cholesterol: 0, sodium: 1, totalCarbs: 22.8, dietaryFiber: 2.6, totalSugars: 12.2, iron: 0.3, calcium: 5, potassium: 358, vitaminD: 0 },
  },
  "applesauce": {
    name: "Unsweetened Applesauce",
    macrosPer100g: { calories: 42, protein: 0.2, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 2, totalCarbs: 11.3, dietaryFiber: 1.3, totalSugars: 9.4, iron: 0.1, calcium: 4, potassium: 74, vitaminD: 0 },
  },
  "cinnamon": {
    name: "Ground Cinnamon",
    macrosPer100g: { calories: 247, protein: 4.0, totalFat: 1.2, saturatedFat: 0.3, cholesterol: 0, sodium: 10, totalCarbs: 80.6, dietaryFiber: 53.1, totalSugars: 2.2, iron: 8.3, calcium: 1002, potassium: 431, vitaminD: 0 },
  },
  "sweetener": {
    name: "Zero-Calorie Sweetener",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 0, totalCarbs: 4, dietaryFiber: 0, totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "vanilla-extract": {
    name: "Vanilla Extract",
    macrosPer100g: { calories: 288, protein: 0.1, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 9, totalCarbs: 12.7, dietaryFiber: 0, totalSugars: 12.7, iron: 0.1, calcium: 11, potassium: 148, vitaminD: 0 },
  },
  "cooking-spray": {
    name: "Cooking Spray",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 0, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "guar-gum": {
    name: "Guar Gum",
    macrosPer100g: { calories: 20, protein: 5.0, totalFat: 0.5, saturatedFat: 0, cholesterol: 0, sodium: 2, totalCarbs: 79, dietaryFiber: 79, totalSugars: 0, iron: 3.0, calcium: 50, potassium: 500, vitaminD: 0 },
  },
  "baking-powder": {
    name: "Baking Powder",
    macrosPer100g: { calories: 53, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 10600, totalCarbs: 28, dietaryFiber: 0, totalSugars: 0, iron: 11, calcium: 5876, potassium: 20, vitaminD: 0 },
  },
  "baking-soda": {
    name: "Baking Soda",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 27400, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "apple": {
    name: "Apple (chopped)",
    macrosPer100g: { calories: 52, protein: 0.3, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 13.8, dietaryFiber: 2.4, totalSugars: 10.4, iron: 0.1, calcium: 6, potassium: 107, vitaminD: 0 },
  },
  "blueberries": {
    name: "Fresh Blueberries",
    macrosPer100g: { calories: 57, protein: 0.7, totalFat: 0.3, saturatedFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 14.5, dietaryFiber: 2.4, totalSugars: 10.0, iron: 0.3, calcium: 6, potassium: 77, vitaminD: 0 },
  },
  "cauliflower": {
    name: "Cauliflower",
    macrosPer100g: { calories: 25, protein: 1.9, totalFat: 0.3, saturatedFat: 0, cholesterol: 0, sodium: 30, totalCarbs: 5, dietaryFiber: 2, totalSugars: 1.9, iron: 0.4, calcium: 22, potassium: 299, vitaminD: 0 },
  },
  "ground-beef-95": {
    name: "95% Lean Ground Beef",
    macrosPer100g: { calories: 137, protein: 21.4, totalFat: 5.0, saturatedFat: 2.2, cholesterol: 65, sodium: 66, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 2.3, calcium: 10, potassium: 318, vitaminD: 0 },
  },
  "chicken-breast": {
    name: "Chicken Breast (raw)",
    macrosPer100g: { calories: 120, protein: 22.5, totalFat: 2.6, saturatedFat: 0.6, cholesterol: 73, sodium: 45, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.4, calcium: 5, potassium: 370, vitaminD: 0.1 },
  },
};

// ============================================================================
// SAMPLE RECIPES (will be replaced by PDF extraction)
// ============================================================================

const RECIPES: Recipe[] = [
  {
    slug: "anabolic-french-toast",
    title: "ANABOLIC FRENCH TOAST",
    category: "Breakfast",
    subcategory: "French Toast",
    servings: 1,
    prepTime: "5m",
    cookTime: "8m",
    dietary: { glutenFree: true, dairyFree: true, soyFree: true, nutFree: true, eggFree: false },
    ingredients: [
      { id: "egg-whites", originalId: "egg-whites", name: "Liquid Egg Whites", amountG: 180, displayUS: "3/4 cup", displayMetric: "180g", category: "wet", isSwappable: true, substitutionGroupId: "eggs" },
      { id: "gf-bread", originalId: "gf-bread", name: "Certified GF Bread", amountG: 80, displayUS: "2 slices", displayMetric: "80g", category: "dry", isSwappable: true, substitutionGroupId: "bread" },
      { id: "sweetener", originalId: "sweetener", name: "Zero-Calorie Sweetener", amountG: 4, displayUS: "2 packets", displayMetric: "4g", category: "dry", isSwappable: false },
      { id: "cinnamon", originalId: "cinnamon", name: "Ground Cinnamon", amountG: 3, displayUS: "1/2 tsp", displayMetric: "3g", category: "dry", isSwappable: false },
      { id: "vanilla-extract", originalId: "vanilla-extract", name: "Vanilla Extract", amountG: 5, displayUS: "1 tsp", displayMetric: "5g", category: "wet", isSwappable: false },
      { id: "cooking-spray", originalId: "cooking-spray", name: "Cooking Spray", amountG: 1, displayUS: "1 spray", displayMetric: "1g", category: "wet", isSwappable: false },
    ],
    instructions: [
      { title: "Prep the Batter", text: "In a bowl, add egg whites, sweetener, cinnamon, and vanilla extract. Whisk until spices are evenly distributed throughout the mixture." },
      { title: "Heat the Griddle", text: "Heat a griddle over low-medium heat. Spray griddle with cooking spray." },
      { title: "Dip and Cook", text: "Dip bread slices into egg white mixture, and transfer to pan. Spoon any leftover egg white mixture into the bread in the pan. If done slowly, the bread should absorb the mixture and get fluffy." },
      { title: "Flip and Serve", text: "Let cook for about 3-4 minutes on each side. Remove French toast from the pan and serve on a plate with toppings. Suggestions: fresh fruit and low-calorie syrup." },
    ],
    notes: "Any sturdy certified gluten-free sandwich bread works; if it is smaller than the original bread, monitor pan time so it does not dry out.",
  },
  {
    slug: "apple-protein-pancakes",
    title: "APPLE PROTEIN PANCAKES",
    category: "Breakfast",
    subcategory: "Pancakes",
    servings: 5,
    prepTime: "10m",
    cookTime: "15m",
    dietary: { glutenFree: true, dairyFree: true, soyFree: true, nutFree: true, eggFree: false },
    ingredients: [
      { id: "egg-whites", originalId: "egg-whites", name: "Liquid Egg Whites", amountG: 480, displayUS: "2 cups", displayMetric: "480g", category: "wet", isSwappable: true, substitutionGroupId: "eggs" },
      { id: "gf-oat-flour", originalId: "gf-oat-flour", name: "Certified GF Rolled Oats", amountG: 65, displayUS: "3/4 cup", displayMetric: "65g", category: "dry", isSwappable: true, substitutionGroupId: "flour" },
      { id: "oat-yogurt", originalId: "oat-yogurt", name: "Thick Dairy-Free Yogurt", amountG: 125, displayUS: "1/2 cup", displayMetric: "125g", category: "wet", isSwappable: true, substitutionGroupId: "yogurt" },
      { id: "apple", originalId: "apple", name: "Apples", amountG: 380, displayUS: "2 medium", displayMetric: "380g", category: "wet", isSwappable: false },
      { id: "cinnamon", originalId: "cinnamon", name: "Ground Cinnamon", amountG: 4, displayUS: "1.5 tsp", displayMetric: "4g", category: "dry", isSwappable: false },
      { id: "sweetener", originalId: "sweetener", name: "Sweetener", amountG: 6, displayUS: "3 packets", displayMetric: "6g", category: "dry", isSwappable: false },
      { id: "guar-gum", originalId: "guar-gum", name: "Guar Gum", amountG: 6, displayUS: "2 tsp", displayMetric: "6g", category: "dry", isSwappable: false },
      { id: "baking-powder", originalId: "baking-powder", name: "Baking Powder", amountG: 5, displayUS: "1 tsp", displayMetric: "5g", category: "dry", isSwappable: false },
    ],
    instructions: [
      { title: "Blend the Batter", text: "Add all ingredients into the blender, and blend on high for 1 minute or until a uniform consistency is achieved." },
      { title: "Rest (Optional)", text: "Transfer blended mixture to an airtight container, and let sit in refrigerator for 4 hours. Note: these can be eaten right away, but it is preferable to let the batter thicken over a few hours." },
      { title: "Cook", text: "Heat a griddle over low-medium heat. Spray griddle with cooking spray. Add mixture to griddle and let sit for 1-2 minutes until edges appear cooked through." },
      { title: "Flip and Serve", text: "Flip pancake with a spatula, and let sit for another 30-60 seconds, depending on doneness. Remove pancake from the griddle and serve on a plate with toppings of choice." },
    ],
  },
  {
    slug: "blueberry-protein-muffins",
    title: "BLUEBERRY PROTEIN MUFFINS",
    category: "Breakfast",
    subcategory: "Muffins",
    servings: 10,
    prepTime: "10m",
    cookTime: "18m",
    dietary: { glutenFree: true, dairyFree: true, soyFree: true, nutFree: true, eggFree: false },
    ingredients: [
      { id: "applesauce", originalId: "applesauce", name: "Unsweetened Applesauce", amountG: 250, displayUS: "1 cup", displayMetric: "250g", category: "wet", isSwappable: false },
      { id: "oat-yogurt", originalId: "oat-yogurt", name: "Thick Dairy-Free Yogurt", amountG: 175, displayUS: "3/4 cup", displayMetric: "175g", category: "wet", isSwappable: true, substitutionGroupId: "yogurt" },
      { id: "egg-whites", originalId: "egg-whites", name: "Egg Whites", amountG: 60, displayUS: "1/4 cup", displayMetric: "60g", category: "wet", isSwappable: true, substitutionGroupId: "eggs" },
      { id: "pea-protein", originalId: "pea-protein", name: "Dairy-Free Protein Powder", amountG: 66, displayUS: "2 scoops", displayMetric: "66g", category: "dry", isSwappable: true, substitutionGroupId: "protein" },
      { id: "gf-oat-flour", originalId: "gf-oat-flour", name: "Certified GF Oat Flour", amountG: 240, displayUS: "2 cups", displayMetric: "240g", category: "dry", isSwappable: true, substitutionGroupId: "flour" },
      { id: "blueberries", originalId: "blueberries", name: "Fresh Blueberries", amountG: 270, displayUS: "2 cups", displayMetric: "270g", category: "wet", isSwappable: false },
      { id: "vanilla-extract", originalId: "vanilla-extract", name: "Vanilla Extract", amountG: 5, displayUS: "1 tsp", displayMetric: "5g", category: "wet", isSwappable: false },
      { id: "sweetener", originalId: "sweetener", name: "Sweetener", amountG: 12, displayUS: "6 packets", displayMetric: "12g", category: "dry", isSwappable: false },
      { id: "baking-powder", originalId: "baking-powder", name: "Baking Powder", amountG: 6, displayUS: "1.5 tsp", displayMetric: "6g", category: "dry", isSwappable: false },
      { id: "baking-soda", originalId: "baking-soda", name: "Baking Soda", amountG: 4, displayUS: "1/2 tsp", displayMetric: "4g", category: "dry", isSwappable: false },
    ],
    instructions: [
      { title: "Preheat", text: "Preheat the oven to 325°F (163°C)." },
      { title: "Mix Wet", text: "Combine all wet ingredients into a bowl and mix until evenly distributed." },
      { title: "Mix Dry & Combine", text: "In another bowl, combine all dry ingredients and mix. Then, combine the wet and dry ingredients in a bowl. Mix until you get a smooth consistency. Fold in blueberries." },
      { title: "Bake", text: "Spray a muffin tray with cooking spray, and pour the batter into the muffin trays. Be sure to leave approx 1/4 - 1/2 inch of room for the muffins to rise in each tray." },
      { title: "Cool and Serve", text: "Bake for 15-20 minutes, or until toothpick comes out clean (DON'T over bake or else they will be dry). Let cool on a cooling rack and serve." },
    ],
  },
];

// ============================================================================
// LOOKUP FUNCTIONS
// ============================================================================

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}

export function getAllRecipes(): Recipe[] {
  return RECIPES;
}

export function getIngredientDB(): Record<string, IngredientEntry> {
  return INGREDIENT_DB;
}

export function getRecipesByCategory(category: string): Recipe[] {
  return RECIPES.filter((r) => r.category.toLowerCase() === category.toLowerCase());
}
