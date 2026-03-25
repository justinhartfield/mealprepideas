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

  const cx = 150, cy = 140, r = 120;

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

  const zones = [
    { start: 0, end: 25.7, color: "#b91c1c" },
    { start: 25.7, end: 51.4, color: "#f97316" },
    { start: 51.4, end: 77.1, color: "#f59e0b" },
    { start: 77.1, end: 128.6, color: "#22c55e" },
    { start: 128.6, end: 180, color: "#0a4d33" },
  ];

  // Needle: compute endpoint directly from angle (no CSS transform needed)
  const needleRad = (Math.PI * (180 + angle)) / 180;
  const needleLen = r - 20;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  // Needle triangle (wider base for visibility)
  const baseOffset = 6;
  const perpRad = needleRad + Math.PI / 2;
  const bx1 = cx + baseOffset * Math.cos(perpRad);
  const by1 = cy + baseOffset * Math.sin(perpRad);
  const bx2 = cx - baseOffset * Math.cos(perpRad);
  const by2 = cy - baseOffset * Math.sin(perpRad);

  return (
    <div className="w-full">
      <div className="relative max-w-md mx-auto">
        <svg viewBox="0 0 300 175" className="w-full">
          {/* Background arc zones */}
          {zones.map((zone, i) => (
            <path
              key={i}
              d={arcPath(zone.start, zone.end)}
              fill="none"
              stroke={zone.color}
              strokeWidth={24}
              strokeLinecap="butt"
              opacity={0.2}
            />
          ))}

          {/* Active arc */}
          {angle > 0 && (
            <motion.path
              d={arcPath(0, Math.min(angle, 180))}
              fill="none"
              stroke={rating.color}
              strokeWidth={24}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}

          {/* Needle — triangle pointer (no CSS transforms) */}
          <motion.polygon
            points={`${nx},${ny} ${bx1},${by1} ${bx2},${by2}`}
            fill="#1a1a1a"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />

          {/* Needle line for extra visibility */}
          <motion.line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#1a1a1a"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />

          {/* Center dot */}
          <circle cx={cx} cy={cy} r={8} fill="#1a1a1a" />
          <circle cx={cx} cy={cy} r={4} fill={rating.color} />

          {/* Scale labels */}
          <text x={22} y={148} fontSize="11" fill="#78716c" fontWeight="700">0</text>
          <text x={134} y={16} fontSize="11" fill="#78716c" fontWeight="700">1.75</text>
          <text x={258} y={148} fontSize="11" fill="#78716c" fontWeight="700">3.5</text>
        </svg>

        {/* Center value overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <p className="font-['Anton'] text-6xl text-[#1a1a1a] dark:text-white leading-none">
            {peRatio.toFixed(1)}
          </p>
          <p className="text-sm font-black uppercase tracking-widest mt-1" style={{ color: rating.color }}>
            {rating.label}
          </p>
        </div>
      </div>

      {/* Macro Bars */}
      <div className="mt-8 space-y-4 max-w-md mx-auto">
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
      <span className="text-[11px] font-black text-[#78716c] tracking-widest uppercase w-16">{label}</span>
      <div className="flex-1 h-4 bg-black/10 dark:bg-white/10 overflow-hidden rounded-sm">
        <motion.div
          className="h-full rounded-sm"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-sm font-bold text-[#1a1a1a] dark:text-white w-24 text-right">
        {grams}g ({pct}{suffix})
      </span>
    </div>
  );
}
