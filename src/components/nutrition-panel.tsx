"use client";

import { useState } from "react";
import { getDailyValuePercent, type NutrientProfile } from "@/lib/nutrition-engine";

interface NutritionPanelProps {
  perServing: NutrientProfile;
  perRecipe: NutrientProfile;
  servings: number;
}

export function NutritionPanel({ perServing, perRecipe, servings }: NutritionPanelProps) {
  const [showPerRecipe, setShowPerRecipe] = useState(false);
  const data = showPerRecipe ? perRecipe : perServing;

  return (
    <div className="bg-white border-[3px] border-black p-6 max-w-sm mx-auto relative text-black">
      <div className="absolute -top-3 -right-3 bg-[#0a4d33] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
        USDA Verified
      </div>

      <h2 className="font-['Anton'] text-5xl text-black border-b-[10px] border-black pb-2 mb-3">Nutrition Facts</h2>

      {/* Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setShowPerRecipe(false)}
          className={`px-3 py-1.5 text-[10px] font-black tracking-widest transition-colors ${!showPerRecipe ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          PER SERVING
        </button>
        <button
          onClick={() => setShowPerRecipe(true)}
          className={`px-3 py-1.5 text-[10px] font-black tracking-widest transition-colors ${showPerRecipe ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          PER RECIPE
        </button>
      </div>

      <p className="font-bold text-black border-b border-black pb-1 mb-2 text-sm">
        {showPerRecipe ? `${servings} servings total` : `${servings} servings per container`}
      </p>

      <div className="flex justify-between items-end border-b-[6px] border-black pb-1 mb-2">
        <div>
          <span className="font-['Anton'] text-sm text-black block">Amount per {showPerRecipe ? 'recipe' : 'serving'}</span>
          <span className="font-['Anton'] text-4xl text-black">Calories</span>
        </div>
        <span className="font-['Anton'] text-5xl text-black">{data.calories}</span>
      </div>

      <div className="text-right text-[11px] font-bold text-black border-b border-black/30 pb-1 mb-1">% Daily Value*</div>

      <NutrientRow label="Total Fat" value={`${data.totalFat}g`} dv={getDailyValuePercent('totalFat', data.totalFat)} bold />
      <NutrientRow label="  Saturated Fat" value={`${data.saturatedFat}g`} dv={getDailyValuePercent('saturatedFat', data.saturatedFat)} indent />
      <NutrientRow label="Cholesterol" value={`${data.cholesterol}mg`} dv={getDailyValuePercent('cholesterol', data.cholesterol)} bold />
      <NutrientRow label="Sodium" value={`${data.sodium}mg`} dv={getDailyValuePercent('sodium', data.sodium)} bold />
      <NutrientRow label="Total Carbohydrate" value={`${data.totalCarbs}g`} dv={getDailyValuePercent('totalCarbs', data.totalCarbs)} bold />
      <NutrientRow label="  Dietary Fiber" value={`${data.dietaryFiber}g`} dv={getDailyValuePercent('dietaryFiber', data.dietaryFiber)} indent />
      <NutrientRow label="  Total Sugars" value={`${data.totalSugars}g`} indent />

      <div className="border-b-[6px] border-black my-1" />

      <div className="flex justify-between border-b-[3px] border-black py-1">
        <span className="font-['Anton'] text-xl text-[#f59e0b]">Protein {data.protein}g</span>
        <span className="font-['Anton'] text-xl text-black">{getDailyValuePercent('protein', data.protein)}%</span>
      </div>

      <div className="border-b-[6px] border-black my-1" />

      <NutrientRow label="Vitamin D" value={`${data.vitaminD}mcg`} dv={getDailyValuePercent('vitaminD', data.vitaminD)} />
      <NutrientRow label="Calcium" value={`${data.calcium}mg`} dv={getDailyValuePercent('calcium', data.calcium)} />
      <NutrientRow label="Iron" value={`${data.iron}mg`} dv={getDailyValuePercent('iron', data.iron)} />
      <NutrientRow label="Potassium" value={`${data.potassium}mg`} dv={getDailyValuePercent('potassium', data.potassium)} />

      <p className="text-[9px] mt-3 leading-tight text-gray-500">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </p>
    </div>
  );
}

function NutrientRow({ label, value, dv, bold, indent }: {
  label: string; value: string; dv?: number | null; bold?: boolean; indent?: boolean;
}) {
  return (
    <div className={`flex justify-between border-b border-gray-300 py-1 ${indent ? 'pl-4' : ''}`}>
      <span className={`text-sm text-black ${bold ? 'font-bold' : 'font-medium'}`}>
        {label} {value}
      </span>
      {dv !== null && dv !== undefined && (
        <span className="text-sm font-bold text-black">{dv}%</span>
      )}
    </div>
  );
}
