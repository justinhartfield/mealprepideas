/**
 * Recipe Data Module
 * Loads all 135 recipes from extracted JSON data and provides lookup functions.
 */

import type { NutrientProfile, RecipeIngredient } from "@/lib/nutrition-engine";
import recipesRaw from "@/../data/recipes-raw.json";

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
  "certified-gluten-free-bread": {
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
  "certified-gluten-free-oat-flour": {
    name: "Certified GF Oat Flour",
    macrosPer100g: { calories: 404, protein: 14.7, totalFat: 9.1, saturatedFat: 1.6, cholesterol: 0, sodium: 3, totalCarbs: 65.7, dietaryFiber: 6.5, totalSugars: 0.8, iron: 3.6, calcium: 55, potassium: 371, vitaminD: 0 },
    substitutes: ["rice-flour", "tigernut-flour"],
  },
  "certified-gluten-free-rolled-oats": {
    name: "Certified GF Rolled Oats",
    macrosPer100g: { calories: 389, protein: 16.9, totalFat: 6.9, saturatedFat: 1.2, cholesterol: 0, sodium: 2, totalCarbs: 66.3, dietaryFiber: 10.6, totalSugars: 0, iron: 4.7, calcium: 54, potassium: 429, vitaminD: 0 },
  },
  "certified-gluten-free-self-rising-flour-blend": {
    name: "Certified GF Self-Rising Flour Blend",
    macrosPer100g: { calories: 360, protein: 5.0, totalFat: 1.0, saturatedFat: 0, cholesterol: 0, sodium: 500, totalCarbs: 78, dietaryFiber: 2, totalSugars: 0, iron: 4.0, calcium: 200, potassium: 100, vitaminD: 0 },
  },
  "rice-flour": {
    name: "White Rice Flour",
    macrosPer100g: { calories: 366, protein: 5.9, totalFat: 1.4, saturatedFat: 0.4, cholesterol: 0, sodium: 0, totalCarbs: 80.1, dietaryFiber: 2.4, totalSugars: 0.1, iron: 0.4, calcium: 10, potassium: 76, vitaminD: 0 },
  },
  "tigernut-flour": {
    name: "Tigernut Flour",
    macrosPer100g: { calories: 400, protein: 4.0, totalFat: 24.0, saturatedFat: 5.0, cholesterol: 0, sodium: 10, totalCarbs: 50, dietaryFiber: 25, totalSugars: 20, iron: 3.0, calcium: 30, potassium: 400, vitaminD: 0 },
  },
  "chocolate-dairy-free-soy-free-protein-powder": {
    name: "Chocolate Dairy-Free Protein Powder",
    macrosPer100g: { calories: 375, protein: 78, totalFat: 3.8, saturatedFat: 0.5, cholesterol: 0, sodium: 800, totalCarbs: 5, dietaryFiber: 1, totalSugars: 1, iron: 10, calcium: 50, potassium: 50, vitaminD: 0 },
    substitutes: ["vanilla-dairy-free-soy-free-protein-powder", "pea-protein"],
  },
  "dairy-free-soy-free-chocolate-protein-powder": {
    name: "Chocolate Dairy-Free Protein Powder",
    macrosPer100g: { calories: 375, protein: 78, totalFat: 3.8, saturatedFat: 0.5, cholesterol: 0, sodium: 800, totalCarbs: 5, dietaryFiber: 1, totalSugars: 1, iron: 10, calcium: 50, potassium: 50, vitaminD: 0 },
    substitutes: ["vanilla-dairy-free-soy-free-protein-powder", "pea-protein"],
  },
  "vanilla-dairy-free-soy-free-protein-powder": {
    name: "Vanilla Dairy-Free Protein Powder",
    macrosPer100g: { calories: 375, protein: 78, totalFat: 3.5, saturatedFat: 0.5, cholesterol: 0, sodium: 750, totalCarbs: 6, dietaryFiber: 1, totalSugars: 1, iron: 10, calcium: 50, potassium: 50, vitaminD: 0 },
    substitutes: ["chocolate-dairy-free-soy-free-protein-powder", "pea-protein"],
  },
  "dairy-free-soy-free-protein-powder": {
    name: "Dairy-Free Protein Powder",
    macrosPer100g: { calories: 375, protein: 80, totalFat: 3.8, saturatedFat: 0.5, cholesterol: 0, sodium: 800, totalCarbs: 3, dietaryFiber: 1, totalSugars: 0.5, iron: 10, calcium: 50, potassium: 50, vitaminD: 0 },
  },
  "dairy-free-soy-free-protein-powder-of-choice": {
    name: "Dairy-Free Protein Powder",
    macrosPer100g: { calories: 375, protein: 80, totalFat: 3.8, saturatedFat: 0.5, cholesterol: 0, sodium: 800, totalCarbs: 3, dietaryFiber: 1, totalSugars: 0.5, iron: 10, calcium: 50, potassium: 50, vitaminD: 0 },
  },
  "cinnamon-or-vanilla-dairy-free-soy-free-protein-powder": {
    name: "Cinnamon/Vanilla Dairy-Free Protein Powder",
    macrosPer100g: { calories: 375, protein: 78, totalFat: 3.5, saturatedFat: 0.5, cholesterol: 0, sodium: 750, totalCarbs: 6, dietaryFiber: 1, totalSugars: 1, iron: 10, calcium: 50, potassium: 50, vitaminD: 0 },
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
  "thick-unsweetened-dairy-free-yogurt": {
    name: "Thick Unsweetened Dairy-Free Yogurt",
    macrosPer100g: { calories: 75, protein: 2.0, totalFat: 2.5, saturatedFat: 0.3, cholesterol: 0, sodium: 30, totalCarbs: 12, dietaryFiber: 1, totalSugars: 4, iron: 0.3, calcium: 120, potassium: 100, vitaminD: 0.5 },
    substitutes: ["coconut-yogurt"],
  },
  "thick-dairy-free-yogurt": {
    name: "Thick Dairy-Free Yogurt",
    macrosPer100g: { calories: 75, protein: 2.0, totalFat: 2.5, saturatedFat: 0.3, cholesterol: 0, sodium: 30, totalCarbs: 12, dietaryFiber: 1, totalSugars: 4, iron: 0.3, calcium: 120, potassium: 100, vitaminD: 0.5 },
    substitutes: ["coconut-yogurt"],
  },
  "coconut-yogurt": {
    name: "Coconut Yogurt (Unsweetened)",
    macrosPer100g: { calories: 110, protein: 1.0, totalFat: 7.0, saturatedFat: 6.0, cholesterol: 0, sodium: 15, totalCarbs: 10, dietaryFiber: 0, totalSugars: 4, iron: 0.5, calcium: 10, potassium: 80, vitaminD: 0 },
  },
  "sunflower-seed-butter-powder": {
    name: "Sunflower Seed Butter Powder",
    macrosPer100g: { calories: 400, protein: 40, totalFat: 12, saturatedFat: 1.5, cholesterol: 0, sodium: 300, totalCarbs: 33, dietaryFiber: 5, totalSugars: 7, iron: 4, calcium: 60, potassium: 500, vitaminD: 0 },
  },
  "sunflower-seed-butter": {
    name: "Sunflower Seed Butter",
    macrosPer100g: { calories: 617, protein: 17.3, totalFat: 51.5, saturatedFat: 5.2, cholesterol: 0, sodium: 2, totalCarbs: 23.3, dietaryFiber: 4.6, totalSugars: 7.5, iron: 3.8, calcium: 49, potassium: 536, vitaminD: 0 },
  },
  "unsweetened-oat-milk": {
    name: "Unsweetened Oat Milk",
    macrosPer100g: { calories: 40, protein: 1.0, totalFat: 1.5, saturatedFat: 0.2, cholesterol: 0, sodium: 80, totalCarbs: 7, dietaryFiber: 1, totalSugars: 3, iron: 0.3, calcium: 120, potassium: 80, vitaminD: 1.0 },
  },
  "coconut-aminos": {
    name: "Coconut Aminos",
    macrosPer100g: { calories: 100, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 3800, totalCarbs: 20, dietaryFiber: 0, totalSugars: 20, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "dairy-free-cheese-alternative": {
    name: "Dairy-Free Cheese Alternative",
    macrosPer100g: { calories: 250, protein: 2.0, totalFat: 18, saturatedFat: 4, cholesterol: 0, sodium: 700, totalCarbs: 20, dietaryFiber: 0, totalSugars: 0, iron: 0.5, calcium: 200, potassium: 30, vitaminD: 0 },
  },
  "fat-free-dairy-free-cheese-alternative": {
    name: "Fat-Free Dairy-Free Cheese Alternative",
    macrosPer100g: { calories: 160, protein: 3.0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 800, totalCarbs: 36, dietaryFiber: 0, totalSugars: 0, iron: 0.5, calcium: 200, potassium: 30, vitaminD: 0 },
  },
  "banana": {
    name: "Banana",
    macrosPer100g: { calories: 89, protein: 1.1, totalFat: 0.3, saturatedFat: 0.1, cholesterol: 0, sodium: 1, totalCarbs: 22.8, dietaryFiber: 2.6, totalSugars: 12.2, iron: 0.3, calcium: 5, potassium: 358, vitaminD: 0 },
  },
  "overripe-banana": {
    name: "Overripe Banana",
    macrosPer100g: { calories: 89, protein: 1.1, totalFat: 0.3, saturatedFat: 0.1, cholesterol: 0, sodium: 1, totalCarbs: 22.8, dietaryFiber: 2.6, totalSugars: 12.2, iron: 0.3, calcium: 5, potassium: 358, vitaminD: 0 },
  },
  "unsweetened-applesauce": {
    name: "Unsweetened Applesauce",
    macrosPer100g: { calories: 42, protein: 0.2, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 2, totalCarbs: 11.3, dietaryFiber: 1.3, totalSugars: 9.4, iron: 0.1, calcium: 4, potassium: 74, vitaminD: 0 },
  },
  "unsweetened-apple-sauce": {
    name: "Unsweetened Apple Sauce",
    macrosPer100g: { calories: 42, protein: 0.2, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 2, totalCarbs: 11.3, dietaryFiber: 1.3, totalSugars: 9.4, iron: 0.1, calcium: 4, potassium: 74, vitaminD: 0 },
  },
  "apples": {
    name: "Apples (chopped)",
    macrosPer100g: { calories: 52, protein: 0.3, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 13.8, dietaryFiber: 2.4, totalSugars: 10.4, iron: 0.1, calcium: 6, potassium: 107, vitaminD: 0 },
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
  "guarxanthan-gum": {
    name: "Guar/Xanthan Gum",
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
  "cocoa-powder": {
    name: "Unsweetened Cocoa Powder",
    macrosPer100g: { calories: 228, protein: 19.6, totalFat: 13.7, saturatedFat: 8.1, cholesterol: 0, sodium: 21, totalCarbs: 57.9, dietaryFiber: 33.2, totalSugars: 1.8, iron: 13.9, calcium: 128, potassium: 1524, vitaminD: 0 },
  },
  "water": {
    name: "Water",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 0, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "ice": {
    name: "Ice",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 0, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
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
  "sugar-free-chocolate-chips": {
    name: "Sugar-Free Chocolate Chips",
    macrosPer100g: { calories: 480, protein: 5.0, totalFat: 36, saturatedFat: 22, cholesterol: 0, sodium: 10, totalCarbs: 56, dietaryFiber: 12, totalSugars: 0, iron: 4.0, calcium: 30, potassium: 300, vitaminD: 0 },
  },
  "salt": {
    name: "Salt",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 38758, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.3, calcium: 24, potassium: 8, vitaminD: 0 },
  },
  "salt--pepper": {
    name: "Salt & Pepper",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 38758, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.3, calcium: 24, potassium: 8, vitaminD: 0 },
  },
  "salt-and-pepper": {
    name: "Salt and Pepper",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 38758, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.3, calcium: 24, potassium: 8, vitaminD: 0 },
  },
  "sea-salt": {
    name: "Sea Salt",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 38758, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.3, calcium: 24, potassium: 8, vitaminD: 0 },
  },
  "kosher-salt": {
    name: "Kosher Salt",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 38758, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.3, calcium: 24, potassium: 8, vitaminD: 0 },
  },
  "prepared-fibro-syrup-or-imo-syrup": {
    name: "Fibro/IMO Syrup",
    macrosPer100g: { calories: 200, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 10, totalCarbs: 70, dietaryFiber: 60, totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "walden-farms-chocolate-syrup": {
    name: "Walden Farms Chocolate Syrup",
    macrosPer100g: { calories: 0, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 200, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "low-calorie-syrup": {
    name: "Low-Calorie Syrup",
    macrosPer100g: { calories: 15, protein: 0, totalFat: 0, saturatedFat: 0, cholesterol: 0, sodium: 100, totalCarbs: 8, dietaryFiber: 4, totalSugars: 0, iron: 0, calcium: 0, potassium: 0, vitaminD: 0 },
  },
  "fresh-blueberries": {
    name: "Fresh Blueberries",
    macrosPer100g: { calories: 57, protein: 0.7, totalFat: 0.3, saturatedFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 14.5, dietaryFiber: 2.4, totalSugars: 10.0, iron: 0.3, calcium: 6, potassium: 77, vitaminD: 0 },
  },
  "strawberries": {
    name: "Strawberries",
    macrosPer100g: { calories: 32, protein: 0.7, totalFat: 0.3, saturatedFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 7.7, dietaryFiber: 2.0, totalSugars: 4.9, iron: 0.4, calcium: 16, potassium: 153, vitaminD: 0 },
  },
  "frozen-strawberries": {
    name: "Frozen Strawberries",
    macrosPer100g: { calories: 35, protein: 0.4, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 9.1, dietaryFiber: 1.8, totalSugars: 5.2, iron: 0.3, calcium: 12, potassium: 120, vitaminD: 0 },
  },
  "pumpkin-pure": {
    name: "Pumpkin Puree",
    macrosPer100g: { calories: 34, protein: 1.1, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 4, totalCarbs: 8.1, dietaryFiber: 2.9, totalSugars: 3.3, iron: 0.6, calcium: 26, potassium: 206, vitaminD: 0 },
  },
  "minced-garlic": {
    name: "Minced Garlic",
    macrosPer100g: { calories: 149, protein: 6.4, totalFat: 0.5, saturatedFat: 0, cholesterol: 0, sodium: 17, totalCarbs: 33.1, dietaryFiber: 2.1, totalSugars: 1.0, iron: 1.7, calcium: 181, potassium: 401, vitaminD: 0 },
  },
  "paprika": {
    name: "Paprika",
    macrosPer100g: { calories: 282, protein: 14.1, totalFat: 13.0, saturatedFat: 2.1, cholesterol: 0, sodium: 68, totalCarbs: 53.9, dietaryFiber: 34.9, totalSugars: 10.3, iron: 21.1, calcium: 229, potassium: 2280, vitaminD: 0 },
  },
  "dijon-mustard": {
    name: "Dijon Mustard",
    macrosPer100g: { calories: 66, protein: 4.4, totalFat: 3.3, saturatedFat: 0.2, cholesterol: 0, sodium: 1900, totalCarbs: 5.8, dietaryFiber: 2.6, totalSugars: 2.2, iron: 1.5, calcium: 60, potassium: 138, vitaminD: 0 },
  },
  "lemon-juice": {
    name: "Lemon Juice",
    macrosPer100g: { calories: 22, protein: 0.4, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 6.9, dietaryFiber: 0.3, totalSugars: 2.5, iron: 0.1, calcium: 6, potassium: 103, vitaminD: 0 },
  },
  "avocado": {
    name: "Avocado",
    macrosPer100g: { calories: 160, protein: 2.0, totalFat: 14.7, saturatedFat: 2.1, cholesterol: 0, sodium: 7, totalCarbs: 8.5, dietaryFiber: 6.7, totalSugars: 0.7, iron: 0.6, calcium: 12, potassium: 485, vitaminD: 0 },
  },
  "chickpeas-canned-rinsed": {
    name: "Chickpeas (Canned, Rinsed)",
    macrosPer100g: { calories: 139, protein: 7.0, totalFat: 2.6, saturatedFat: 0.3, cholesterol: 0, sodium: 210, totalCarbs: 22.5, dietaryFiber: 6.0, totalSugars: 3.6, iron: 1.7, calcium: 46, potassium: 172, vitaminD: 0 },
  },
  "smartpop-popcorn": {
    name: "SmartPop Popcorn",
    macrosPer100g: { calories: 400, protein: 11.4, totalFat: 11.4, saturatedFat: 2.9, cholesterol: 0, sodium: 571, totalCarbs: 68.6, dietaryFiber: 14.3, totalSugars: 0, iron: 2.0, calcium: 10, potassium: 200, vitaminD: 0 },
  },
  "chicken-breast-boneless-and-skinless": {
    name: "Chicken Breast (boneless, skinless)",
    macrosPer100g: { calories: 120, protein: 22.5, totalFat: 2.6, saturatedFat: 0.6, cholesterol: 73, sodium: 45, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.4, calcium: 5, potassium: 370, vitaminD: 0.1 },
  },
  "low-carb-high-fiber-certified-gluten-free-tortillas": {
    name: "GF Low-Carb Tortillas",
    macrosPer100g: { calories: 200, protein: 8, totalFat: 5, saturatedFat: 1, cholesterol: 0, sodium: 500, totalCarbs: 30, dietaryFiber: 15, totalSugars: 1, iron: 2, calcium: 100, potassium: 80, vitaminD: 0 },
    substitutes: ["certified-gluten-free-bread"],
  },
  "certified-gluten-free-tortillas": {
    name: "Certified GF Tortillas",
    macrosPer100g: { calories: 220, protein: 4, totalFat: 5, saturatedFat: 1.5, cholesterol: 0, sodium: 450, totalCarbs: 38, dietaryFiber: 3, totalSugars: 2, iron: 2, calcium: 80, potassium: 60, vitaminD: 0 },
  },
  "lean-ground-turkey-or-beef-raw": {
    name: "Lean Ground Turkey/Beef",
    macrosPer100g: { calories: 150, protein: 20, totalFat: 7, saturatedFat: 2, cholesterol: 70, sodium: 65, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 2, calcium: 10, potassium: 300, vitaminD: 0 },
  },
  "lean-deli-ham-diced": {
    name: "Lean Deli Ham",
    macrosPer100g: { calories: 120, protein: 18, totalFat: 4, saturatedFat: 1.3, cholesterol: 50, sodium: 1100, totalCarbs: 2, dietaryFiber: 0, totalSugars: 1, iron: 0.7, calcium: 10, potassium: 250, vitaminD: 0 },
  },
  "ham-diced": {
    name: "Ham (diced)",
    macrosPer100g: { calories: 120, protein: 18, totalFat: 4, saturatedFat: 1.3, cholesterol: 50, sodium: 1100, totalCarbs: 2, dietaryFiber: 0, totalSugars: 1, iron: 0.7, calcium: 10, potassium: 250, vitaminD: 0 },
  },
  "tomato-diced": {
    name: "Tomato (diced)",
    macrosPer100g: { calories: 18, protein: 0.9, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 5, totalCarbs: 3.9, dietaryFiber: 1.2, totalSugars: 2.6, iron: 0.3, calcium: 10, potassium: 237, vitaminD: 0 },
  },
  "tomato": {
    name: "Tomato",
    macrosPer100g: { calories: 18, protein: 0.9, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 5, totalCarbs: 3.9, dietaryFiber: 1.2, totalSugars: 2.6, iron: 0.3, calcium: 10, potassium: 237, vitaminD: 0 },
  },
  "sliced-tomato": {
    name: "Sliced Tomato",
    macrosPer100g: { calories: 18, protein: 0.9, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 5, totalCarbs: 3.9, dietaryFiber: 1.2, totalSugars: 2.6, iron: 0.3, calcium: 10, potassium: 237, vitaminD: 0 },
  },
  "yellow-onion": {
    name: "Yellow Onion",
    macrosPer100g: { calories: 40, protein: 1.1, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 4, totalCarbs: 9.3, dietaryFiber: 1.7, totalSugars: 4.2, iron: 0.2, calcium: 23, potassium: 146, vitaminD: 0 },
  },
  "yellow-onion-diced": {
    name: "Yellow Onion (diced)",
    macrosPer100g: { calories: 40, protein: 1.1, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 4, totalCarbs: 9.3, dietaryFiber: 1.7, totalSugars: 4.2, iron: 0.2, calcium: 23, potassium: 146, vitaminD: 0 },
  },
  "chopped-onion": {
    name: "Chopped Onion",
    macrosPer100g: { calories: 40, protein: 1.1, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 4, totalCarbs: 9.3, dietaryFiber: 1.7, totalSugars: 4.2, iron: 0.2, calcium: 23, potassium: 146, vitaminD: 0 },
  },
  "spinach": {
    name: "Fresh Spinach",
    macrosPer100g: { calories: 23, protein: 2.9, totalFat: 0.4, saturatedFat: 0.1, cholesterol: 0, sodium: 79, totalCarbs: 3.6, dietaryFiber: 2.2, totalSugars: 0.4, iron: 2.7, calcium: 99, potassium: 558, vitaminD: 0 },
  },
  "fresh-spinach": {
    name: "Fresh Spinach",
    macrosPer100g: { calories: 23, protein: 2.9, totalFat: 0.4, saturatedFat: 0.1, cholesterol: 0, sodium: 79, totalCarbs: 3.6, dietaryFiber: 2.2, totalSugars: 0.4, iron: 2.7, calcium: 99, potassium: 558, vitaminD: 0 },
  },
  "spinach-leaves": {
    name: "Spinach Leaves",
    macrosPer100g: { calories: 23, protein: 2.9, totalFat: 0.4, saturatedFat: 0.1, cholesterol: 0, sodium: 79, totalCarbs: 3.6, dietaryFiber: 2.2, totalSugars: 0.4, iron: 2.7, calcium: 99, potassium: 558, vitaminD: 0 },
  },
  "red-bell-pepper": {
    name: "Red Bell Pepper",
    macrosPer100g: { calories: 31, protein: 1, totalFat: 0.3, saturatedFat: 0, cholesterol: 0, sodium: 4, totalCarbs: 6, dietaryFiber: 2.1, totalSugars: 4.2, iron: 0.4, calcium: 7, potassium: 211, vitaminD: 0 },
  },
  "mushrooms": {
    name: "Button Mushrooms",
    macrosPer100g: { calories: 22, protein: 3.1, totalFat: 0.3, saturatedFat: 0, cholesterol: 0, sodium: 5, totalCarbs: 3.3, dietaryFiber: 1, totalSugars: 2, iron: 0.5, calcium: 3, potassium: 318, vitaminD: 0.2 },
  },
  "button-mushrooms-sliced": {
    name: "Sliced Mushrooms",
    macrosPer100g: { calories: 22, protein: 3.1, totalFat: 0.3, saturatedFat: 0, cholesterol: 0, sodium: 5, totalCarbs: 3.3, dietaryFiber: 1, totalSugars: 2, iron: 0.5, calcium: 3, potassium: 318, vitaminD: 0.2 },
  },
  "salsa": {
    name: "Salsa",
    macrosPer100g: { calories: 36, protein: 1.5, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 600, totalCarbs: 7, dietaryFiber: 1.5, totalSugars: 4, iron: 0.5, calcium: 20, potassium: 200, vitaminD: 0 },
  },
  "pasta-sauce": {
    name: "Pasta Sauce",
    macrosPer100g: { calories: 50, protein: 1.5, totalFat: 1.5, saturatedFat: 0.2, cholesterol: 0, sodium: 400, totalCarbs: 8, dietaryFiber: 2, totalSugars: 5, iron: 0.8, calcium: 20, potassium: 300, vitaminD: 0 },
  },
  "salmon-filet": {
    name: "Salmon Fillet (raw)",
    macrosPer100g: { calories: 208, protein: 20, totalFat: 13.4, saturatedFat: 3.1, cholesterol: 55, sodium: 59, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.3, calcium: 12, potassium: 363, vitaminD: 11 },
  },
  "tilapia-filet-raw": {
    name: "Tilapia (raw)",
    macrosPer100g: { calories: 96, protein: 20.1, totalFat: 1.7, saturatedFat: 0.6, cholesterol: 50, sodium: 52, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.6, calcium: 10, potassium: 302, vitaminD: 3.1 },
  },
  "shrimp-peeled-and-deveined-raw": {
    name: "Shrimp (raw)",
    macrosPer100g: { calories: 85, protein: 20.1, totalFat: 0.5, saturatedFat: 0.1, cholesterol: 161, sodium: 119, totalCarbs: 0.2, dietaryFiber: 0, totalSugars: 0, iron: 0.5, calcium: 64, potassium: 113, vitaminD: 0 },
  },
  "pork-tenderloin-raw": {
    name: "Pork Tenderloin (raw)",
    macrosPer100g: { calories: 120, protein: 21, totalFat: 3.5, saturatedFat: 1.2, cholesterol: 66, sodium: 48, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 1, calcium: 5, potassium: 382, vitaminD: 0.4 },
  },
  "gluten-free-lasagna-noodles": {
    name: "Gluten-Free Lasagna Noodles",
    macrosPer100g: { calories: 350, protein: 7, totalFat: 1.5, saturatedFat: 0.3, cholesterol: 0, sodium: 10, totalCarbs: 77, dietaryFiber: 3, totalSugars: 2, iron: 2, calcium: 20, potassium: 100, vitaminD: 0 },
  },
  "zucchini": {
    name: "Zucchini",
    macrosPer100g: { calories: 17, protein: 1.2, totalFat: 0.3, saturatedFat: 0.1, cholesterol: 0, sodium: 8, totalCarbs: 3.1, dietaryFiber: 1, totalSugars: 2.5, iron: 0.4, calcium: 16, potassium: 261, vitaminD: 0 },
  },
  "asparagus-spears": {
    name: "Asparagus",
    macrosPer100g: { calories: 20, protein: 2.2, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 2, totalCarbs: 3.9, dietaryFiber: 2.1, totalSugars: 1.9, iron: 2.1, calcium: 24, potassium: 202, vitaminD: 0 },
  },
  "carrots-shredded": {
    name: "Carrots (shredded)",
    macrosPer100g: { calories: 41, protein: 0.9, totalFat: 0.2, saturatedFat: 0, cholesterol: 0, sodium: 69, totalCarbs: 10, dietaryFiber: 2.8, totalSugars: 4.7, iron: 0.3, calcium: 33, potassium: 320, vitaminD: 0 },
  },
  "potatoes": {
    name: "Potatoes",
    macrosPer100g: { calories: 77, protein: 2, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 6, totalCarbs: 17, dietaryFiber: 2.2, totalSugars: 0.8, iron: 0.8, calcium: 12, potassium: 421, vitaminD: 0 },
  },
  "sweet-potato": {
    name: "Sweet Potato",
    macrosPer100g: { calories: 86, protein: 1.6, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 55, totalCarbs: 20, dietaryFiber: 3, totalSugars: 4.2, iron: 0.6, calcium: 30, potassium: 337, vitaminD: 0 },
  },
  "panko-certified-gluten-free-breadcrumbs": {
    name: "GF Panko Breadcrumbs",
    macrosPer100g: { calories: 395, protein: 8, totalFat: 4, saturatedFat: 0.7, cholesterol: 0, sodium: 600, totalCarbs: 78, dietaryFiber: 3, totalSugars: 5, iron: 4, calcium: 50, potassium: 100, vitaminD: 0 },
  },
  "chicken-broth": {
    name: "Chicken Broth",
    macrosPer100g: { calories: 7, protein: 1.1, totalFat: 0.2, saturatedFat: 0.1, cholesterol: 0, sodium: 343, totalCarbs: 0.2, dietaryFiber: 0, totalSugars: 0.2, iron: 0, calcium: 4, potassium: 24, vitaminD: 0 },
  },
  "beef-broth": {
    name: "Beef Broth",
    macrosPer100g: { calories: 8, protein: 1.1, totalFat: 0.2, saturatedFat: 0.1, cholesterol: 0, sodium: 340, totalCarbs: 0.3, dietaryFiber: 0, totalSugars: 0.3, iron: 0, calcium: 4, potassium: 50, vitaminD: 0 },
  },
  "tomato-paste": {
    name: "Tomato Paste",
    macrosPer100g: { calories: 82, protein: 4.3, totalFat: 0.5, saturatedFat: 0.1, cholesterol: 0, sodium: 98, totalCarbs: 19, dietaryFiber: 4.1, totalSugars: 12, iron: 3.4, calcium: 36, potassium: 1014, vitaminD: 0 },
  },
  "corn-starch": {
    name: "Corn Starch",
    macrosPer100g: { calories: 381, protein: 0.3, totalFat: 0.1, saturatedFat: 0, cholesterol: 0, sodium: 9, totalCarbs: 91, dietaryFiber: 0.9, totalSugars: 0, iron: 0.5, calcium: 2, potassium: 3, vitaminD: 0 },
  },
  "canned-tuna": {
    name: "Canned Tuna (in water)",
    macrosPer100g: { calories: 86, protein: 19, totalFat: 0.8, saturatedFat: 0.2, cholesterol: 42, sodium: 290, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 1, calcium: 11, potassium: 207, vitaminD: 1.7 },
  },
  "smoked-salmon": {
    name: "Smoked Salmon",
    macrosPer100g: { calories: 117, protein: 18.3, totalFat: 4.3, saturatedFat: 0.9, cholesterol: 23, sodium: 784, totalCarbs: 0, dietaryFiber: 0, totalSugars: 0, iron: 0.9, calcium: 11, potassium: 175, vitaminD: 11.3 },
  },
  "deli-meat": {
    name: "Lean Deli Meat",
    macrosPer100g: { calories: 100, protein: 18, totalFat: 2, saturatedFat: 0.7, cholesterol: 40, sodium: 900, totalCarbs: 2, dietaryFiber: 0, totalSugars: 1, iron: 0.7, calcium: 10, potassium: 200, vitaminD: 0 },
  },
  "rice-cakes": {
    name: "Rice Cakes",
    macrosPer100g: { calories: 387, protein: 8.0, totalFat: 2.8, saturatedFat: 0.6, cholesterol: 0, sodium: 285, totalCarbs: 81.5, dietaryFiber: 3.4, totalSugars: 0, iron: 0.6, calcium: 3, potassium: 120, vitaminD: 0 },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/** Slugify an ingredient name: lowercase, replace spaces/special with hyphens */
function slugifyIngredient(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Swappable ingredient keywords and their substitution groups */
const SWAPPABLE_KEYWORDS: [RegExp, string][] = [
  [/protein powder/i, "protein"],
  [/\bbread\b/i, "bread"],
  [/yogurt/i, "yogurt"],
  [/oat flour/i, "flour"],
  [/self-rising flour/i, "flour"],
  [/oat milk/i, "milk"],
  [/almond milk/i, "milk"],
  [/peanut butter/i, "nut-butter"],
  [/sunflower seed butter(?! powder)/i, "nut-butter"],
  [/soy sauce/i, "soy-sauce"],
  [/coconut aminos/i, "soy-sauce"],
  [/cottage cheese/i, "cheese"],
  [/cheese alternative/i, "cheese"],
  [/tortilla/i, "bread"],
  [/flatbread/i, "bread"],
  [/rice cake/i, "bread"],
];

function getSwapInfo(ingredientName: string): { isSwappable: boolean; substitutionGroupId?: string } {
  for (const [pattern, group] of SWAPPABLE_KEYWORDS) {
    if (pattern.test(ingredientName)) {
      return { isSwappable: true, substitutionGroupId: group };
    }
  }
  return { isSwappable: false };
}

/** Parse yield string to a number (e.g. "5 PANCAKES" -> 5, "1 SERVING" -> 1) */
function parseYield(yieldStr: string): number {
  // Try to extract leading number
  const match = yieldStr.match(/^(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  // "varies" or other non-numeric
  return 1;
}

/** Generate an instruction title from step number and text */
function generateInstructionTitle(step: number, text: string): string {
  // Take first few meaningful words, max ~4 words, and capitalize
  const words = text.replace(/[.!,;:]/g, "").split(/\s+/).slice(0, 4);
  if (words.length >= 3) {
    return words.slice(0, 3).join(" ");
  }
  return `Step ${step}`;
}

// ============================================================================
// RAW DATA TYPES (matching recipes-raw.json schema)
// ============================================================================

interface RawIngredient {
  name: string;
  amountG: number | null;
  displayUS: string;
  category: "dry" | "wet";
}

interface RawInstruction {
  step: number;
  text: string;
}

interface RawRecipe {
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  yield: string;
  prepTime: string;
  cookTime: string;
  ingredients: RawIngredient[];
  instructions: RawInstruction[];
  recipeNotes: string | null;
  dietaryFlags: {
    glutenFree: boolean;
    dairyFree: boolean;
    soyFree: boolean;
    nutFree: boolean;
    eggFree: boolean;
  };
}

// ============================================================================
// MAP RAW RECIPES TO APP RECIPES
// ============================================================================

function mapRawRecipe(raw: RawRecipe): Recipe {
  const ingredients: RecipeIngredient[] = raw.ingredients.map((ing) => {
    const id = slugifyIngredient(ing.name);
    const amountG = ing.amountG ?? 0;
    const { isSwappable, substitutionGroupId } = getSwapInfo(ing.name);

    return {
      id,
      originalId: id,
      name: ing.name,
      amountG,
      displayUS: ing.displayUS,
      displayMetric: amountG > 0 ? `${amountG}g` : ing.displayUS,
      category: ing.category,
      isSwappable,
      ...(substitutionGroupId ? { substitutionGroupId } : {}),
    };
  });

  const instructions = raw.instructions.map((inst) => ({
    title: generateInstructionTitle(inst.step, inst.text),
    text: inst.text,
  }));

  return {
    slug: raw.slug,
    title: raw.title,
    category: raw.category,
    subcategory: raw.subcategory,
    servings: parseYield(raw.yield),
    prepTime: raw.prepTime,
    cookTime: raw.cookTime,
    dietary: raw.dietaryFlags,
    ingredients,
    instructions,
    ...(raw.recipeNotes ? { notes: raw.recipeNotes } : {}),
  };
}

const RECIPES: Recipe[] = (recipesRaw as RawRecipe[]).map(mapRawRecipe);

// Build slug index for O(1) lookups
const RECIPE_BY_SLUG = new Map<string, Recipe>();
for (const recipe of RECIPES) {
  RECIPE_BY_SLUG.set(recipe.slug, recipe);
}

// ============================================================================
// LOOKUP FUNCTIONS
// ============================================================================

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPE_BY_SLUG.get(slug);
}

export function getAllRecipes(): Recipe[] {
  return RECIPES;
}

export function getIngredientDB(): Record<string, IngredientEntry> {
  return new Proxy(INGREDIENT_DB, {
    get(target, prop: string) {
      // Exact match first
      if (prop in target) return target[prop];
      // Fuzzy: check if any DB key is a substring of the requested key, or vice versa
      for (const key of Object.keys(target)) {
        if (prop.includes(key) || key.includes(prop)) return target[key];
      }
      // Keyword matching: try matching the core ingredient name
      const keywords = prop.split('-').filter(w => w.length > 3);
      for (const key of Object.keys(target)) {
        const keyWords = key.split('-');
        const matches = keywords.filter(kw => keyWords.some(kk => kk.includes(kw) || kw.includes(kk)));
        if (matches.length >= 2) return target[key];
      }
      return undefined;
    },
    has(target, prop: string) {
      if (prop in target) return true;
      for (const key of Object.keys(target)) {
        if (prop.includes(key) || key.includes(prop)) return true;
      }
      return false;
    }
  });
}

export function getRecipesByCategory(category: string): Recipe[] {
  return RECIPES.filter((r) => r.category.toLowerCase() === category.toLowerCase());
}
