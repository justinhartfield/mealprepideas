# Design System — Allergy-Friendly Anabolic Cookbook

## Brand
Premium fitness/bodybuilding recipe site. Clean, bold, high-protein aesthetic. Industrial typography meets modern glassmorphism.

## Colors
- **Brand Orange**: #f59e0b (CTAs, protein highlights, accent)
- **Official Green**: #0a4d33 (primary actions, P:E good scores, allergen badges)
- **Charcoal**: #1a1a1a (headers, dark sections, nav)
- **Paper White**: #f8faf9 (backgrounds)
- **Surface**: #f1f5f0 (cards, alternating rows)
- **Hazard Red**: #b91c1c (warnings, penalties, bad P:E)
- **Stone 400**: #a8a29e (muted text)
- **Stone 500**: #78716c (secondary text)
- **Gold**: #c5a059 (prestige accents, badges)
- **Border**: rgba(0,0,0,0.08)

## Typography
- **Headings**: font-family: 'Anton', sans-serif; letter-spacing: 0.05em; text-transform: uppercase;
- **Body**: font-family: 'Inter', sans-serif;
- **Labels**: font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
- **Stats**: Anton font, large sizes (3xl-7xl), italic for emphasis

## Component Patterns

### Glass Nav
```tsx
<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
    <a href="/" className="font-['Anton'] text-2xl tracking-wide text-[#1a1a1a]">ANABOLIC<span className="text-[#f59e0b]">ALLERGY</span></a>
    <nav className="hidden md:flex space-x-8">
      <a className="text-[#78716c] hover:text-[#f59e0b] font-semibold text-sm uppercase tracking-wider">Recipes</a>
    </nav>
  </div>
</header>
```

### Stats Bar
```tsx
<div className="grid grid-cols-3 md:grid-cols-6 gap-4 py-8 border-y border-black/5">
  <div className="text-center">
    <p className="text-[10px] font-bold text-[#a8a29e] uppercase tracking-[3px]">Protein</p>
    <p className="font-['Anton'] text-3xl text-[#f59e0b]">25G</p>
  </div>
</div>
```

### Hyper Border Card (Dark accent)
```tsx
<div className="bg-[#0a4d33] p-6 md:p-8">
  <p className="text-[10px] font-bold tracking-[3px] text-white/60 uppercase">Label</p>
  <p className="font-['Anton'] text-5xl text-white mt-2">Value</p>
</div>
```

### Allergen Badge
```tsx
<span className="px-3 py-1.5 bg-[#0a4d33]/10 text-[#0a4d33] text-xs font-bold rounded-full">GF</span>
```

### Recipe Card
```tsx
<div className="bg-white border border-black/5 hover:border-[#f59e0b]/30 transition-all group">
  <div className="aspect-[4/3] bg-[#f1f5f0] overflow-hidden">
    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>
  <div className="p-5">
    <p className="text-[10px] font-bold text-[#a8a29e] tracking-[2px] uppercase">Category</p>
    <h3 className="font-['Anton'] text-xl text-[#1a1a1a] mt-1 uppercase">Title</h3>
    <div className="flex gap-4 mt-3 text-sm">
      <span className="font-bold text-[#f59e0b]">25g protein</span>
      <span className="text-[#78716c]">180 cal</span>
      <span className="bg-[#0a4d33] text-white px-2 py-0.5 text-xs font-bold">P:E 1.8</span>
    </div>
  </div>
</div>
```

### USDA Nutrition Panel
```tsx
<div className="bg-white border-2 border-[#1a1a1a] p-8 max-w-sm">
  <h2 className="font-['Anton'] text-5xl border-b-8 border-[#1a1a1a] pb-2 mb-4">Nutrition Facts</h2>
  <p className="font-bold border-b border-[#1a1a1a] pb-1 mb-2">Servings per container</p>
  <div className="flex justify-between border-b-4 border-[#1a1a1a] pb-1 mb-2">
    <span className="font-['Anton'] text-xl">Serving size</span>
    <span className="font-['Anton'] text-xl">1 serving</span>
  </div>
  <div className="flex justify-between border-b border-black/20 py-1">
    <span className="font-bold text-sm">Total Fat Xg</span>
    <span className="font-bold text-sm">X%</span>
  </div>
</div>
```

### P:E Gauge
Half-circle SVG dial with:
- Color zones from red (left) to green (right)
- Animated needle using framer-motion
- Large P:E number centered below the arc
- Macro percentage bars beneath

### Ingredient Row (Interactive)
```tsx
<div className="flex items-center justify-between py-3 px-4 hover:bg-[#f1f5f0] cursor-pointer border-b border-black/5 transition-colors">
  <div className="flex items-center gap-3">
    <input type="checkbox" className="w-5 h-5 rounded border-[#a8a29e] text-[#f59e0b] focus:ring-[#f59e0b]" />
    <span className="text-[#1a1a1a] font-medium">Ingredient Name</span>
  </div>
  <span className="font-['Anton'] text-[#a8a29e]">180g</span>
</div>
```

### Mobile-First
- Single column ingredients on mobile, two columns on md+
- Touch targets minimum 48x48px
- Sticky bottom bar on mobile for key actions
- Cooking mode: enlarged text, step-by-step focus

## Scale: zoomed (large, bold sizing — bodybuilding audience)
