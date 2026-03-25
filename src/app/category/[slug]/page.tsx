"use client";

import React, { useMemo } from 'react';
import { Anton, Inter } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import { getAllRecipes, getIngredientDB } from '@/data/recipe-data';
import type { Recipe } from '@/data/recipe-data';
import { calculateIngredientNutrients, sumNutrients, divideNutrients, calculatePERatio } from '@/lib/nutrition-engine';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const SLUG_TO_CATEGORY: Record<string, string> = {
  breakfast: 'Breakfast',
  appetizers: 'Appetizers',
  sandwiches: 'Tacos, Wraps & Sandwiches',
  dinner: 'Dinner',
  treats: 'Treats',
  desserts: 'Desserts',
  shakes: 'Protein Shakes & Ice Cream',
  proteinsicles: 'Proteinsicles',
  'rice-cake-sandwiches': 'Rice Cake Sandwiches',
};

const SLUG_TO_EMOJI: Record<string, string> = {
  breakfast: '🍳',
  appetizers: '🥟',
  sandwiches: '🌯',
  dinner: '🥩',
  treats: '🍪',
  desserts: '🍰',
  shakes: '🍦',
  proteinsicles: '🧊',
  'rice-cake-sandwiches': '🍙',
};

type Allergen = 'GF' | 'DF' | 'SF' | 'NF' | 'EF';

function getAllergenBadges(recipe: Recipe): Allergen[] {
  const badges: Allergen[] = [];
  if (recipe.dietary.glutenFree) badges.push('GF');
  if (recipe.dietary.dairyFree) badges.push('DF');
  if (recipe.dietary.soyFree) badges.push('SF');
  if (recipe.dietary.nutFree) badges.push('NF');
  if (recipe.dietary.eggFree) badges.push('EF');
  return badges;
}

const ingredientDB = getIngredientDB();

function estimateNutrition(recipe: Recipe): { protein: number; calories: number; peRatio: number } {
  const profiles = recipe.ingredients.map((ing) => {
    const dbEntry = ingredientDB[ing.id];
    if (!dbEntry) return null;
    return calculateIngredientNutrients(dbEntry.macrosPer100g, ing.amountG);
  }).filter(Boolean) as import('@/lib/nutrition-engine').NutrientProfile[];

  const perRecipe = sumNutrients(profiles);
  const perServing = divideNutrients(perRecipe, recipe.servings || 1);
  const peRatio = calculatePERatio(perServing);

  return {
    protein: Math.round(perServing.protein),
    calories: perServing.calories,
    peRatio,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const categoryName = SLUG_TO_CATEGORY[slug] || slug;
  const emoji = SLUG_TO_EMOJI[slug] || '📂';

  const recipes = useMemo(() => {
    const all = getAllRecipes();
    return all.filter(
      (r) => r.category.toLowerCase() === categoryName.toLowerCase()
    );
  }, [categoryName]);

  return (
    <div className={`min-h-screen bg-[#f8faf9] ${inter.className}`}>
      {/* Glass Nav Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-24">
          <a href="/" className={`${anton.className} text-3xl tracking-wide text-[#1a1a1a]`}>
            MEAL<span className="text-[#f59e0b]">PREP</span>IDEAS
          </a>
          <nav className="hidden lg:flex space-x-12">
            {['Recipes', 'Categories', 'P:E Chart', 'Substitutions'].map((item) => (
              <a key={item} href="/" className="text-[#78716c] hover:text-[#f59e0b] font-bold text-xs uppercase tracking-[0.2em] transition-colors">{item}</a>
            ))}
          </nav>
          <button className="bg-[#1a1a1a] text-white px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-[#f59e0b] transition-colors">
            Get Cookbook
          </button>
        </div>
      </header>

      {/* Dark Charcoal Category Header */}
      <section className="bg-[#1a1a1a] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f59e0b] blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0a4d33] blur-[120px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-[#f59e0b] font-bold text-xs uppercase tracking-[0.2em] transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Back to All Recipes
          </a>
          <div className="flex items-center gap-6 mb-6">
            <span className="text-6xl">{emoji}</span>
            <h1 className={`${anton.className} text-5xl md:text-8xl text-white leading-[0.9] tracking-tighter uppercase`}>
              {categoryName}
            </h1>
          </div>
          <p className="text-stone-400 text-lg font-bold uppercase tracking-widest">
            {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'}
          </p>
        </div>
      </section>

      {/* Recipe Cards Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => {
              const allergens = getAllergenBadges(recipe);
              const { protein, calories, peRatio } = estimateNutrition(recipe);

              return (
                <a
                  key={recipe.slug}
                  href={`/recipe/${recipe.slug}`}
                  className="bg-white border border-black/5 hover:border-[#f59e0b]/30 transition-all group flex flex-col"
                >
                  <div className="aspect-[4/3] bg-[#f1f5f0] overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://cfls.b-cdn.net/mealprepideas/${recipe.slug}.webp`}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 pointer-events-none">🍽️</div>
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                      {allergens.map((a) => (
                        <span key={a} className="bg-[#1a1a1a]/80 backdrop-blur-md text-[10px] text-white px-2 py-1 font-black">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-[#a8a29e] tracking-[3px] uppercase mb-2">{recipe.category}</p>
                    <h3 className={`${anton.className} text-2xl text-[#1a1a1a] mb-6 uppercase leading-tight group-hover:text-[#f59e0b] transition-colors`}>
                      {recipe.title}
                    </h3>
                    <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#1a1a1a]">{protein}g Protein</p>
                        <p className="text-xs font-bold text-[#78716c]">{calories} Calories</p>
                      </div>
                      <div className="bg-[#0a4d33] text-white px-4 py-2 text-sm font-black italic">P:E {peRatio}</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-[#a8a29e] font-bold text-xl uppercase tracking-widest">No recipes found in this category yet</p>
            <a
              href="/"
              className="inline-flex mt-8 bg-[#f59e0b] text-[#1a1a1a] px-10 py-5 text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform items-center gap-3"
            >
              <ArrowLeft size={18} />
              Browse All Recipes
            </a>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div>
              <a href="/" className={`${anton.className} text-3xl tracking-wide text-[#1a1a1a]`}>MEAL<span className="text-[#f59e0b]">PREP</span>IDEAS</a>
              <p className="text-stone-500 text-sm mt-6 font-medium leading-loose">The ultimate culinary resource for bodybuilders and athletes managing food allergies. Meal planning without the inflammation.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#1a1a1a] mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm font-bold text-[#78716c]">
                <li><a href="/" className="hover:text-[#f59e0b]">All Recipes</a></li>
                <li><a href="/" className="hover:text-[#f59e0b]">P:E Calculator</a></li>
                <li><a href="/" className="hover:text-[#f59e0b]">Substitution Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#1a1a1a] mb-8">Categories</h4>
              <ul className="space-y-4 text-sm font-bold text-[#78716c]">
                <li><a href="/category/breakfast" className="hover:text-[#f59e0b]">Breakfast</a></li>
                <li><a href="/category/dinner" className="hover:text-[#f59e0b]">Dinner</a></li>
                <li><a href="/category/treats" className="hover:text-[#f59e0b]">Treats & Desserts</a></li>
                <li><a href="/category/shakes" className="hover:text-[#f59e0b]">Shakes & Ice Cream</a></li>
              </ul>
            </div>
            <div className="bg-[#f1f5f0] p-8">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#1a1a1a] mb-6">Empire</h4>
              <p className="text-xs font-bold text-[#a8a29e] mb-4 uppercase">Protein Recipe Network</p>
              <div className="space-y-3 text-sm font-black text-[#1a1a1a]">
                <div className="hover:text-[#f59e0b] cursor-pointer">PROTEINMUFFINS.COM</div>
                <div className="hover:text-[#f59e0b] cursor-pointer">PROTEIN-BREAD.COM</div>
                <div className="hover:text-[#f59e0b] cursor-pointer">PROTEINCOOKIES.CO</div>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-[#a8a29e] tracking-widest uppercase">&copy; 2026 MealPrepIdeas. Nutrition by USDA FoodData Central.</p>
            <div className="flex gap-8 text-[10px] font-black tracking-widest text-[#1a1a1a] uppercase">
              <a href="#" className="hover:text-[#f59e0b]">Privacy</a>
              <a href="#" className="hover:text-[#f59e0b]">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
