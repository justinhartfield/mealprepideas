"use client";

import { useState } from "react";
import { getDailyValuePercent, type NutrientProfile } from "@/lib/nutrition-engine";

interface NutritionPanelProps {
  perServing: NutrientProfile;
  perRecipe: NutrientProfile;
  servings: number;
  servingSize?: string;
}

export function NutritionPanel({ perServing, perRecipe, servings }: NutritionPanelProps) {
  const [showPerRecipe, setShowPerRecipe] = useState(false);
  const data = showPerRecipe ? perRecipe : perServing;

  return (
    <div className="bg-white border-2 border-[#1a1a1a] p-6 max-w-sm mx-auto relative">
      <div className="absolute -top-3 -right-3 bg-[#0a4d33] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
        USDA Verified
      </div>

      <h2 className="font-['Anton'] text-4xl border-b-8 border-[#1a1a1a] pb-2 mb-3">Nutrition Facts</h2>

      {/* Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setShowPerRecipe(false)}
          className={`px-3 py-1.5 text-[10px] font-black tracking-widest transition-colors ${!showPerRecipe ? 'bg-[#1a1a1a] text-white' : 'bg-[#f1f5f0] text-[#78716c]'}`}
        >
          PER SERVING
        </button>
        <button
          onClick={() => setShowPerRecipe(true)}
          className={`px-3 py-1.5 text-[10px] font-black tracking-widest transition-colors ${showPerRecipe ? 'bg-[#1a1a1a] text-white' : 'bg-[#f1f5f0] text-[#78716c]'}`}
        >
          PER RECIPE
        </button>
      </div>

      <p className="font-bold border-b border-[#1a1a1a] pb-1 mb-2 text-sm">
        {showPerRecipe ? `${servings} servings total` : `${servings} servings per container`}
      </p>

      <div className="flex justify-between items-end border-b-4 border-[#1a1a1a] pb-1 mb-2">
        <div>
          <span className="font-['Anton'] text-sm block">Amount per {showPerRecipe ? 'recipe' : 'serving'}</span>
          <span className="font-['Anton'] text-3xl">Calories</span>
        </div>
        <span className="font-['Anton'] text-4xl">{data.calories}</span>
      </div>

      <div className="text-right text-[10px] font-bold text-[#78716c] border-b border-black/10 pb-1 mb-1">% Daily Value*</div>

      <NutrientRow label="Total Fat" value={`${data.totalFat}g`} dv={getDailyValuePercent('totalFat', data.totalFat)} bold />
      <NutrientRow label="Saturated Fat" value={`${data.saturatedFat}g`} dv={getDailyValuePercent('saturatedFat', data.saturatedFat)} indent />
      <NutrientRow label="Cholesterol" value={`${data.cholesterol}mg`} dv={getDailyValuePercent('cholesterol', data.cholesterol)} bold />
      <NutrientRow label="Sodium" value={`${data.sodium}mg`} dv={getDailyValuePercent('sodium', data.sodium)} bold />
      <NutrientRow label="Total Carbohydrate" value={`${data.totalCarbs}g`} dv={getDailyValuePercent('totalCarbs', data.totalCarbs)} bold />
      <NutrientRow label="Dietary Fiber" value={`${data.dietaryFiber}g`} dv={getDailyValuePercent('dietaryFiber', data.dietaryFiber)} indent />
      <NutrientRow label="Total Sugars" value={`${data.totalSugars}g`} indent />

      <div className="border-b-4 border-[#1a1a1a] my-1" />

      <NutrientRow label="Protein" value={`${data.protein}g`} dv={getDailyValuePercent('protein', data.protein)} bold highlight />

      <div className="border-b-4 border-[#1a1a1a] my-1" />

      <NutrientRow label="Vitamin D" value={`${data.vitaminD}mcg`} dv={getDailyValuePercent('vitaminD', data.vitaminD)} />
      <NutrientRow label="Calcium" value={`${data.calcium}mg`} dv={getDailyValuePercent('calcium', data.calcium)} />
      <NutrientRow label="Iron" value={`${data.iron}mg`} dv={getDailyValuePercent('iron', data.iron)} />
      <NutrientRow label="Potassium" value={`${data.potassium}mg`} dv={getDailyValuePercent('potassium', data.potassium)} />

      <p className="text-[9px] mt-3 leading-tight text-[#78716c]">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </p>
    </div>
  );
}

function NutrientRow({ label, value, dv, bold, indent, highlight }: {
  label: string; value: string; dv?: number | null; bold?: boolean; indent?: boolean; highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between border-b border-black/10 py-0.5 ${indent ? 'pl-4' : ''}`}>
      <span className={`text-sm ${bold ? 'font-bold' : ''} ${highlight ? 'font-["Anton"] text-lg text-[#f59e0b]' : 'text-[#1a1a1a]'}`}>
        {label} {value}
      </span>
      {dv !== null && dv !== undefined && (
        <span className="text-sm font-bold text-[#1a1a1a]">{dv}%</span>
      )}
    </div>
  );
}
