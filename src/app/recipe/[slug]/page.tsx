"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Anton, Inter } from "next/font/google";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, ChevronUp, ChefHat } from "lucide-react";
import { PEGauge } from "@/components/pe-gauge";
import { NutritionPanel } from "@/components/nutrition-panel";
import { CookingMode } from "@/components/cooking-mode";
import {
  calculateIngredientNutrients,
  sumNutrients,
  divideNutrients,
  calculatePERatio,
  type NutrientProfile,
  type RecipeIngredient,
} from "@/lib/nutrition-engine";
import { getRecipeBySlug, getIngredientDB } from "@/data/recipe-data";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RecipePage() {
  const params = useParams();
  const slug = params.slug as string;
  const recipe = getRecipeBySlug(slug);
  const ingredientDB = getIngredientDB();

  const [currentIngredients, setCurrentIngredients] = useState<RecipeIngredient[]>(
    recipe?.ingredients ?? []
  );
  const [unitSystem, setUnitSystem] = useState<"metric" | "us">("metric");
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null);
  const [showCookingMode, setShowCookingMode] = useState(false);

  const recipeNutrition = useMemo(() => {
    if (!recipe) return null;
    const profiles = currentIngredients.map((ing) => {
      const dbEntry = ingredientDB[ing.id];
      if (!dbEntry) return null;
      return calculateIngredientNutrients(dbEntry.macrosPer100g, ing.amountG);
    }).filter(Boolean) as NutrientProfile[];

    const perRecipe = sumNutrients(profiles);
    const perServing = divideNutrients(perRecipe, recipe.servings);
    const peRatio = calculatePERatio(perServing);
    return { perRecipe, perServing, peRatio };
  }, [currentIngredients, recipe, ingredientDB]);

  const toggleStep = useCallback((step: number) => {
    setCheckedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  }, []);

  const handleSwap = useCallback((originalId: string, newId: string) => {
    const dbEntry = ingredientDB[newId];
    if (!dbEntry) return;
    setCurrentIngredients((prev) =>
      prev.map((ing) =>
        ing.originalId === originalId
          ? { ...ing, id: newId, name: dbEntry.name, isSwapped: newId !== originalId }
          : ing
      )
    );
    setExpandedIngredient(null);
  }, [ingredientDB]);

  if (!recipe) {
    return (
      <div className={`min-h-screen bg-[#f8faf9] flex items-center justify-center ${inter.className}`}>
        <div className="text-center">
          <p className={`${anton.className} text-4xl text-[#1a1a1a]`}>RECIPE NOT FOUND</p>
          <Link href="/" className="text-[#f59e0b] font-bold mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const dryIngredients = currentIngredients.filter((i) => i.category === "dry");
  const wetIngredients = currentIngredients.filter((i) => i.category === "wet");

  return (
    <div className={`min-h-screen bg-[#f8faf9] ${inter.className}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          <Link href="/" className={`${anton.className} text-2xl tracking-wide text-[#1a1a1a]`}>
            MEAL<span className="text-[#f59e0b]">PREP</span>IDEAS
          </Link>
        </div>
      </header>

      {/* Dark Hero */}
      <div className="bg-[#1a1a1a] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-bold mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Recipes
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {["GF", "DF", "SF", "NF"].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-[#0a4d33] text-white text-[10px] font-black tracking-widest">{tag}</span>
            ))}
          </div>
          <p className="text-[10px] font-black text-[#f59e0b] tracking-[0.4em] uppercase mb-2">{recipe.category}</p>
          <h1 className={`${anton.className} text-4xl md:text-6xl text-white leading-[0.95]`}>{recipe.title}</h1>
        </div>
      </div>

      {/* Stats Bar */}
      {recipeNutrition && (
        <div className="bg-[#f1f5f0] border-b border-black/5">
          <div className="max-w-7xl mx-auto grid grid-cols-3 md:grid-cols-6 divide-x divide-black/5">
            {[
              { label: "Protein", val: `${recipeNutrition.perServing.protein}G`, highlight: true },
              { label: "Calories", val: `${recipeNutrition.perServing.calories}` },
              { label: "P:E Ratio", val: recipeNutrition.peRatio.toFixed(1), highlight: true },
              { label: "Prep", val: recipe.prepTime },
              { label: "Cook", val: recipe.cookTime },
              { label: "Yield", val: `${recipe.servings}` },
            ].map((stat, i) => (
              <div key={i} className="py-6 text-center">
                <p className="text-[10px] font-black text-[#a8a29e] tracking-[0.3em] uppercase">{stat.label}</p>
                <p className={`${anton.className} text-2xl md:text-3xl ${stat.highlight ? "text-[#f59e0b]" : "text-[#1a1a1a]"}`}>{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Column */}
          <div className="flex-1 space-y-12">
            {/* Ingredients */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`${anton.className} text-3xl text-[#1a1a1a]`}>INGREDIENTS</h2>
                <div className="flex gap-1 bg-[#f1f5f0] p-1">
                  <button onClick={() => setUnitSystem("metric")} className={`px-4 py-2 text-xs font-black tracking-widest transition-colors ${unitSystem === "metric" ? "bg-white text-[#1a1a1a] shadow" : "text-[#78716c]"}`}>METRIC</button>
                  <button onClick={() => setUnitSystem("us")} className={`px-4 py-2 text-xs font-black tracking-widest transition-colors ${unitSystem === "us" ? "bg-white text-[#1a1a1a] shadow" : "text-[#78716c]"}`}>US CUPS</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <IngredientColumn
                  title="DRY BASE"
                  ingredients={dryIngredients}
                  unitSystem={unitSystem}
                  expandedId={expandedIngredient}
                  onToggleExpand={setExpandedIngredient}
                  onSwap={handleSwap}
                  ingredientDB={ingredientDB}
                />
                <IngredientColumn
                  title="WET MIX"
                  ingredients={wetIngredients}
                  unitSystem={unitSystem}
                  expandedId={expandedIngredient}
                  onToggleExpand={setExpandedIngredient}
                  onSwap={handleSwap}
                  ingredientDB={ingredientDB}
                />
              </div>
            </section>

            {/* Instructions */}
            <section>
              <h2 className={`${anton.className} text-3xl text-[#1a1a1a] mb-6`}>INSTRUCTIONS</h2>
              <div className="space-y-6">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className={`flex gap-4 transition-opacity ${checkedSteps.includes(i) ? "opacity-40" : ""}`}>
                    <button
                      onClick={() => toggleStep(i)}
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center font-['Anton'] text-xl transition-colors ${
                        checkedSteps.includes(i) ? "bg-[#0a4d33] text-white" : "bg-[#f1f5f0] text-[#1a1a1a] hover:bg-[#f59e0b] hover:text-white"
                      }`}
                    >
                      {checkedSteps.includes(i) ? <Check size={20} /> : i + 1}
                    </button>
                    <div className="flex-1 pt-1">
                      <h3 className="font-bold text-[#1a1a1a] mb-1">{step.title}</h3>
                      <p className="text-[#78716c] leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cooking Mode Button */}
            <button
              onClick={() => setShowCookingMode(true)}
              className="w-full flex items-center justify-center gap-3 py-5 bg-[#1a1a1a] text-white font-black text-sm uppercase tracking-widest hover:bg-[#f59e0b] hover:text-[#1a1a1a] transition-colors"
            >
              <ChefHat size={20} /> START COOKING MODE
            </button>

            {/* P:E Gauge */}
            {recipeNutrition && (
              <section>
                <h2 className={`${anton.className} text-3xl text-[#1a1a1a] mb-6`}>P:E RATIO</h2>
                <div className="bg-white border border-black/5 p-8">
                  <PEGauge peRatio={recipeNutrition.peRatio} nutrients={recipeNutrition.perServing} />
                </div>
              </section>
            )}

            {/* Nutrition Panel */}
            {recipeNutrition && (
              <section>
                <h2 className={`${anton.className} text-3xl text-[#1a1a1a] mb-6`}>NUTRITION FACTS</h2>
                <NutritionPanel
                  perServing={recipeNutrition.perServing}
                  perRecipe={recipeNutrition.perRecipe}
                  servings={recipe.servings}
                />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
            <div className="bg-white border border-black/5 p-6">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#1a1a1a] mb-4">ALLERGEN PROFILE</h3>
              <div className="space-y-3">
                {[
                  { label: "Gluten-Free", active: true },
                  { label: "Dairy-Free", active: true },
                  { label: "Soy-Free", active: true },
                  { label: "Nut-Free", active: true },
                ].map((a) => (
                  <div key={a.label} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1a1a1a]">{a.label}</span>
                    <div className={`w-10 h-6 rounded-full flex items-center ${a.active ? "bg-[#0a4d33] justify-end" : "bg-[#e5e7eb] justify-start"}`}>
                      <div className="w-4 h-4 bg-white rounded-full mx-1 shadow" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f59e0b] p-8 sticky top-28">
              <h3 className={`${anton.className} text-2xl text-[#1a1a1a] mb-2`}>GET THE FULL COOKBOOK</h3>
              <p className="text-[#1a1a1a]/70 text-sm mb-6">130+ allergy-friendly anabolic recipes with complete nutrition data.</p>
              <button className="w-full bg-[#1a1a1a] text-white py-4 font-black text-xs tracking-widest uppercase hover:bg-[#0a4d33] transition-colors">
                ORDER NOW
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Cooking Mode Overlay */}
      {showCookingMode && (
        <CookingMode
          recipeName={recipe.title}
          instructions={recipe.instructions}
          onClose={() => setShowCookingMode(false)}
        />
      )}
    </div>
  );
}

function IngredientColumn({
  title, ingredients, unitSystem, expandedId, onToggleExpand, onSwap, ingredientDB,
}: {
  title: string;
  ingredients: RecipeIngredient[];
  unitSystem: "metric" | "us";
  expandedId: string | null;
  onToggleExpand: (id: string | null) => void;
  onSwap: (originalId: string, newId: string) => void;
  ingredientDB: Record<string, { name: string; macrosPer100g: NutrientProfile; substitutes?: string[] }>;
}) {
  return (
    <div>
      <h4 className="text-[10px] font-black text-[#f59e0b] tracking-[0.2em] border-b border-[#f59e0b]/20 pb-2 mb-3 uppercase">{title}</h4>
      <div className="space-y-1">
        {ingredients.map((ing) => {
          const isExpanded = expandedId === ing.originalId;
          const dbEntry = ingredientDB[ing.id];
          const subs = dbEntry?.substitutes ?? [];

          return (
            <div key={ing.originalId}>
              <button
                onClick={() => subs.length > 0 ? onToggleExpand(isExpanded ? null : ing.originalId) : undefined}
                className={`w-full flex items-center justify-between py-3 px-4 transition-colors ${
                  ing.isSwapped ? "bg-[#f59e0b]/10 border-l-2 border-[#f59e0b]" : "hover:bg-[#f1f5f0]"
                } ${subs.length > 0 ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className={`text-sm ${ing.isSwapped ? "text-[#f59e0b] font-bold" : "text-[#1a1a1a] font-medium"}`}>
                    {ing.name}
                  </span>
                  {subs.length > 0 && (
                    isExpanded ? <ChevronUp size={14} className="text-[#a8a29e]" /> : <ChevronDown size={14} className="text-[#a8a29e]" />
                  )}
                </div>
                <span className="font-['Anton'] text-sm text-[#a8a29e]">
                  {unitSystem === "metric" ? ing.displayMetric : ing.displayUS}
                </span>
              </button>

              {isExpanded && subs.length > 0 && (
                <div className="bg-[#f1f5f0] border-l-2 border-[#a8a29e] ml-4 py-2">
                  <p className="text-[10px] font-black text-[#a8a29e] tracking-widest uppercase px-4 mb-2">SWAP WITH:</p>
                  <button
                    onClick={() => onSwap(ing.originalId, ing.originalId)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white transition-colors ${ing.id === ing.originalId ? "font-bold text-[#0a4d33]" : "text-[#78716c]"}`}
                  >
                    {ingredientDB[ing.originalId]?.name ?? ing.originalId} (Original)
                  </button>
                  {subs.map((subId) => {
                    const sub = ingredientDB[subId];
                    if (!sub) return null;
                    return (
                      <button
                        key={subId}
                        onClick={() => onSwap(ing.originalId, subId)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white transition-colors ${ing.id === subId ? "font-bold text-[#0a4d33]" : "text-[#78716c]"}`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
