"use client";

import React, { useState, useMemo } from 'react';
import { Anton, Inter } from 'next/font/google';
import {
  Search,
  Utensils,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { getAllRecipes, getIngredientDB } from '@/data/recipe-data';
import { calculateIngredientNutrients, sumNutrients, divideNutrients, calculatePERatio } from '@/lib/nutrition-engine';
import type { NutrientProfile } from '@/lib/nutrition-engine';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

type Allergen = 'GF' | 'DF' | 'SF' | 'NF' | 'EF';

const ingredientDB = getIngredientDB();
const allRecipes = getAllRecipes();

// Pre-compute nutrition for all recipes
const recipesWithNutrition = allRecipes.map(r => {
  const profiles = r.ingredients.map(ing => {
    const db = ingredientDB[ing.id];
    if (!db) return null;
    return calculateIngredientNutrients(db.macrosPer100g, ing.amountG);
  }).filter(Boolean) as NutrientProfile[];
  const perRecipe = sumNutrients(profiles);
  const perServing = divideNutrients(perRecipe, r.servings || 1);
  const peRatio = calculatePERatio(perServing);
  const allergens: Allergen[] = [];
  if (r.dietary.glutenFree) allergens.push('GF');
  if (r.dietary.dairyFree) allergens.push('DF');
  if (r.dietary.soyFree) allergens.push('SF');
  if (r.dietary.nutFree) allergens.push('NF');
  if (r.dietary.eggFree) allergens.push('EF');
  return { slug: r.slug, title: r.title, category: r.category, protein: Math.round(perServing.protein), calories: perServing.calories, peRatio, allergens };
});

const CATEGORIES = [
  { name: 'Breakfast', count: 36, emoji: '🍳', href: '/category/breakfast' },
  { name: 'Appetizers', count: 4, emoji: '🥟', href: '/category/appetizers' },
  { name: 'Sandwiches & Wraps', count: 22, emoji: '🌯', href: '/category/sandwiches' },
  { name: 'Dinner', count: 21, emoji: '🥩', href: '/category/dinner' },
  { name: 'Treats', count: 27, emoji: '🍪', href: '/category/treats' },
  { name: 'Desserts', count: 11, emoji: '🍰', href: '/category/desserts' },
  { name: 'Shakes & Ice Cream', count: 10, emoji: '🍦', href: '/category/shakes' },
  { name: 'Proteinsicles', count: 4, emoji: '🧊', href: '/category/proteinsicles' },
  { name: 'Seafood', count: 12, emoji: '🐟', href: '/category/seafood' },
];

// No hardcoded recipes — using real data from all 135 recipes

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAllergens, setActiveAllergens] = useState<Allergen[]>([]);
  const [minPe, setMinPe] = useState(0);

  const toggleAllergen = (a: Allergen) => {
    setActiveAllergens(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const filteredRecipes = useMemo(() => {
    return recipesWithNutrition.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAllergens = activeAllergens.every(a => recipe.allergens.includes(a));
      const matchesPe = recipe.peRatio >= minPe;
      return matchesSearch && matchesAllergens && matchesPe;
    });
  }, [searchQuery, activeAllergens, minPe]);

  return (
    <div className={`min-h-screen bg-[#f8faf9] ${inter.className}`}>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-24">
          <a href="/" className={`${anton.className} text-3xl tracking-wide text-[#1a1a1a]`}>
            MEAL<span className="text-[#f59e0b]">PREP</span>IDEAS
          </a>
          <nav className="hidden lg:flex space-x-12">
            <a href="#recipes" className="text-[#78716c] hover:text-[#f59e0b] font-bold text-xs uppercase tracking-[0.2em] transition-colors">Recipes</a>
            <a href="/category/breakfast" className="text-[#78716c] hover:text-[#f59e0b] font-bold text-xs uppercase tracking-[0.2em] transition-colors">Breakfast</a>
            <a href="/category/dinner" className="text-[#78716c] hover:text-[#f59e0b] font-bold text-xs uppercase tracking-[0.2em] transition-colors">Dinner</a>
            <a href="/category/treats" className="text-[#78716c] hover:text-[#f59e0b] font-bold text-xs uppercase tracking-[0.2em] transition-colors">Treats</a>
            <a href="/category/shakes" className="text-[#78716c] hover:text-[#f59e0b] font-bold text-xs uppercase tracking-[0.2em] transition-colors">Shakes</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="bg-[#1a1a1a] text-white px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-[#f59e0b] transition-colors">
              Get Cookbook
            </button>
          </div>
        </div>
      </header>

      <section className="bg-[#1a1a1a] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f59e0b] blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0a4d33] blur-[120px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex justify-center gap-3 mb-10">
            {['GF', 'DF', 'SF', 'NF'].map(tag => (
              <span key={tag} className="px-5 py-2 bg-[#0a4d33] text-white text-xs font-black tracking-widest">{tag}</span>
            ))}
          </div>
          <h1 className={`${anton.className} text-6xl md:text-9xl text-white leading-[0.9] tracking-tighter mb-8 max-w-5xl mx-auto`}>
            ALLERGY-FRIENDLY <span className="text-[#f59e0b]">ANABOLIC</span> COOKBOOK
          </h1>
          <p className="text-stone-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium tracking-wide">
            130+ High-Protein Recipes — Gluten-Free, Dairy-Free, Soy-Free, Nut-Free. Engineered for Maximum Muscle, Zero Inflammation.
          </p>
          <a href="#recipes" className="inline-flex bg-[#f59e0b] text-[#1a1a1a] px-12 py-6 text-lg font-black uppercase tracking-widest hover:scale-105 transition-transform items-center gap-4">
            Browse Recipes <ArrowRight size={24} />
          </a>
        </div>
      </section>

      <section className="bg-[#f1f5f0] border-y border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/5">
            {[
              { label: 'Recipes', val: '130+', sub: 'Hand-crafted' },
              { label: 'Allergen Safe', val: '4-Free', sub: 'GF/DF/SF/NF' },
              { label: 'Interactive', val: 'P:E Chart', sub: 'Live Scaling' },
              { label: 'Verified', val: 'USDA', sub: 'Nutrition Facts' }
            ].map((stat, i) => (
              <div key={i} className="p-10 text-center group hover:bg-white transition-colors">
                <p className={`${anton.className} text-5xl md:text-7xl text-[#1a1a1a] italic group-hover:text-[#f59e0b] transition-colors mb-1`}>{stat.val}</p>
                <span className="text-[10px] font-black text-[#a8a29e] tracking-[0.3em] uppercase">{stat.label}</span>
                <span className="block text-xs font-bold text-[#78716c] uppercase mt-1">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <p className="text-[10px] font-black text-[#f59e0b] tracking-[0.4em] uppercase mb-4">Explore the Menu</p>
        <h2 className={`${anton.className} text-5xl text-[#1a1a1a] mb-12`}>Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <a key={cat.name} href={cat.href} className="group cursor-pointer bg-white border border-black/5 p-8 transition-all hover:border-[#f59e0b] hover:shadow-2xl hover:shadow-[#f59e0b]/10">
              <span className="text-5xl block mb-6 grayscale group-hover:grayscale-0 transition-all group-hover:scale-110">{cat.emoji}</span>
              <h3 className={`${anton.className} text-xl text-[#1a1a1a] group-hover:text-[#f59e0b] transition-colors`}>{cat.name}</h3>
              <p className="text-xs font-bold text-[#a8a29e] mt-2 uppercase tracking-widest">{cat.count} Recipes</p>
            </a>
          ))}
        </div>
      </section>

      <section id="recipes" className="bg-white border-y border-black/5 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative mb-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400" size={28} />
            <input type="text" placeholder="Search 130+ allergy-friendly recipes..." className="w-full bg-[#f1f5f0] border-none py-8 pl-20 pr-8 text-xl font-bold focus:ring-2 focus:ring-[#f59e0b] outline-none" onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
            <div className="flex flex-wrap justify-center gap-3">
              {(['GF', 'DF', 'SF', 'NF', 'EF'] as Allergen[]).map(a => (
                <button key={a} onClick={() => toggleAllergen(a)} className={`px-6 py-3 text-xs font-black tracking-widest border transition-all ${activeAllergens.includes(a) ? 'bg-[#0a4d33] text-white border-[#0a4d33]' : 'bg-transparent text-[#78716c] border-black/10 hover:border-[#0a4d33]'}`}>
                  {a === 'GF' ? 'GLUTEN-FREE' : a === 'DF' ? 'DAIRY-FREE' : a === 'SF' ? 'SOY-FREE' : a === 'NF' ? 'NUT-FREE' : 'EGG-FREE'}
                </button>
              ))}
            </div>
            <div className="w-full md:w-64">
              <div className="flex justify-between text-[10px] font-black tracking-widest text-[#a8a29e] mb-4 uppercase">
                <span>MIN P:E RATIO</span>
                <span className="text-[#f59e0b]">{minPe.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="4" step="0.1" value={minPe} onChange={(e) => setMinPe(parseFloat(e.target.value))} className="w-full accent-[#f59e0b] h-1.5 bg-black/5 appearance-none cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.slice(0, 12).map((recipe) => (
            <a key={recipe.slug} href={`/recipe/${recipe.slug}`} className="bg-white border border-black/5 hover:border-[#f59e0b]/30 transition-all group flex flex-col">
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
                  {recipe.allergens.map(a => (
                    <span key={a} className="bg-[#1a1a1a]/80 backdrop-blur-md text-[10px] text-white px-2 py-1 font-black">{a}</span>
                  ))}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <p className="text-[10px] font-bold text-[#a8a29e] tracking-[3px] uppercase mb-2">{recipe.category}</p>
                <h3 className={`${anton.className} text-2xl text-[#1a1a1a] mb-6 uppercase leading-tight group-hover:text-[#f59e0b] transition-colors`}>{recipe.title}</h3>
                <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-[#1a1a1a]">{recipe.protein}g Protein</p>
                    <p className="text-xs font-bold text-[#78716c]">{recipe.calories} Calories</p>
                  </div>
                  <div className="bg-[#0a4d33] text-white px-4 py-2 text-sm font-black italic">P:E {recipe.peRatio}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
        {filteredRecipes.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[#a8a29e] font-bold text-xl uppercase tracking-widest">No recipes found matching your filters</p>
          </div>
        )}
      </section>

      <section className="bg-[#1a1a1a] py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`${anton.className} text-5xl text-white text-center mb-20 tracking-wide`}>ENGINEERED FOR PROGRESS</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: <Utensils />, title: '1. Pick a Recipe', desc: 'Choose from 130+ muscle-building meals optimized for allergy-free digestion.' },
              { icon: <Zap />, title: '2. Swap Any Ingredient', desc: 'Allergic to something? Swap it. Our system recalculates nutrition automatically.' },
              { icon: <BarChart3 />, title: '3. Live Nutrition', desc: 'Watch your P:E ratio and macro targets recalculate in real-time as you customize.' }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-[#f59e0b] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:rotate-12">
                  {React.cloneElement(step.icon as React.ReactElement, { size: 36, className: 'text-[#1a1a1a]' })}
                </div>
                <h4 className={`${anton.className} text-2xl text-white mb-4 uppercase`}>{step.title}</h4>
                <p className="text-stone-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                <li className="hover:text-[#f59e0b] cursor-pointer">All Recipes</li>
                <li className="hover:text-[#f59e0b] cursor-pointer">P:E Calculator</li>
                <li className="hover:text-[#f59e0b] cursor-pointer">Substitution Guide</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#1a1a1a] mb-8">Categories</h4>
              <ul className="space-y-4 text-sm font-bold text-[#78716c]">
                <li className="hover:text-[#f59e0b] cursor-pointer">Breakfast</li>
                <li className="hover:text-[#f59e0b] cursor-pointer">Dinner</li>
                <li className="hover:text-[#f59e0b] cursor-pointer">Treats & Desserts</li>
                <li className="hover:text-[#f59e0b] cursor-pointer">Shakes & Ice Cream</li>
              </ul>
            </div>
            <div className="bg-[#f1f5f0] p-8">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#1a1a1a] mb-6">Empire</h4>
              <p className="text-xs font-bold text-[#a8a29e] mb-4 uppercase">Protein Recipe Network</p>
              <div className="space-y-3 text-sm font-black text-[#1a1a1a]">
                <div className="flex items-center gap-2 hover:text-[#f59e0b] cursor-pointer"><CheckCircle2 size={16} /> PROTEINMUFFINS.COM</div>
                <div className="flex items-center gap-2 hover:text-[#f59e0b] cursor-pointer"><CheckCircle2 size={16} /> PROTEIN-BREAD.COM</div>
                <div className="flex items-center gap-2 hover:text-[#f59e0b] cursor-pointer"><CheckCircle2 size={16} /> PROTEINCOOKIES.CO</div>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-[#a8a29e] tracking-widest uppercase">© 2026 MealPrepIdeas. Nutrition by USDA FoodData Central.</p>
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
