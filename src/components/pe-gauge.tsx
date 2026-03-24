"use client";

import { motion } from "framer-motion";
import { calculateMacroPercentages, getPERating, peRatioToAngle, type NutrientProfile } from "@/lib/nutrition-engine";

interface PEGaugeProps {
  peRatio: number;
  nutrients: NutrientProfile;
}

export function PEGauge({ peRatio, nutrients }: PEGaugeProps) {
  const angle = peRatioToAngle(peRatio);
  const rating = getPERating(peRatio);
  const macros = calculateMacroPercentages(nutrients);

  // SVG arc parameters
  const cx = 150, cy = 140, r = 120;

  // Create arc path for a segment
  const arcPath = (startAngle: number, endAngle: number) => {
    const startRad = (Math.PI * (180 + startAngle)) / 180;
    const endRad = (Math.PI * (180 + endAngle)) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Color zones mapped to P:E ranges (angles)
  const zones = [
    { start: 0, end: 25.7, color: "#b91c1c" },   // 0-0.5 Poor
    { start: 25.7, end: 51.4, color: "#f97316" },  // 0.5-1.0 Low
    { start: 51.4, end: 77.1, color: "#f59e0b" },  // 1.0-1.5 Moderate
    { start: 77.1, end: 128.6, color: "#22c55e" }, // 1.5-2.5 Good
    { start: 128.6, end: 180, color: "#0a4d33" },  // 2.5+ Excellent
  ];

  // Needle endpoint
  const needleAngle = (Math.PI * (180 + angle)) / 180;
  const needleLen = r - 15;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy + needleLen * Math.sin(needleAngle);

  return (
    <div className="w-full">
      {/* Gauge */}
      <div className="relative max-w-md mx-auto">
        <svg viewBox="0 0 300 170" className="w-full">
          {/* Background arc zones */}
          {zones.map((zone, i) => (
            <path
              key={i}
              d={arcPath(zone.start, zone.end)}
              fill="none"
              stroke={zone.color}
              strokeWidth={20}
              strokeLinecap="butt"
              opacity={0.3}
            />
          ))}

          {/* Active arc up to current value */}
          {angle > 0 && (
            <motion.path
              d={arcPath(0, Math.min(angle, 180))}
              fill="none"
              stroke={rating.color}
              strokeWidth={20}
              strokeLinecap="butt"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}

          {/* Needle */}
          <motion.line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#1a1a1a"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ rotate: -90, originX: `${cx}px`, originY: `${cy}px` }}
            animate={{ rotate: angle - 90 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Center dot */}
          <circle cx={cx} cy={cy} r={6} fill="#1a1a1a" />

          {/* Scale labels */}
          <text x={30} y={145} className="text-[10px] fill-[#a8a29e] font-bold">0</text>
          <text x={140} y={18} className="text-[10px] fill-[#a8a29e] font-bold">1.75</text>
          <text x={260} y={145} className="text-[10px] fill-[#a8a29e] font-bold">3.5</text>
        </svg>

        {/* Center value overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <p className="font-['Anton'] text-5xl text-[#1a1a1a] leading-none">
            {peRatio.toFixed(1)}
          </p>
          <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: rating.color }}>
            {rating.label}
          </p>
        </div>
      </div>

      {/* Macro Bars */}
      <div className="mt-8 space-y-3 max-w-md mx-auto">
        <MacroBar label="Protein" pct={macros.proteinPct} grams={nutrients.protein} color="#3B82F6" />
        <MacroBar label="Fat" pct={macros.fatPct} grams={nutrients.totalFat} color="#EAB308" />
        <MacroBar label="Carbs" pct={macros.carbPct} grams={nutrients.totalCarbs} color="#EF4444" />
        <MacroBar label="Fiber" pct={Math.round((nutrients.dietaryFiber / 28) * 100)} grams={nutrients.dietaryFiber} color="#22C55E" suffix="% DV" />
      </div>
    </div>
  );
}

function MacroBar({ label, pct, grams, color, suffix = "%" }: {
  label: string; pct: number; grams: number; color: string; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-black text-[#a8a29e] tracking-widest uppercase w-16">{label}</span>
      <div className="flex-1 h-3 bg-black/5 overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-bold text-[#1a1a1a] w-20 text-right">
        {grams}g ({pct}{suffix})
      </span>
    </div>
  );
}
