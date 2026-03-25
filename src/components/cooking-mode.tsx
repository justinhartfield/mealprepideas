"use client";

import { useState, useEffect, useCallback } from "react";
import { Anton } from "next/font/google";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });

interface CookingModeProps {
  recipeName: string;
  instructions: { title: string; text: string }[];
  onClose: () => void;
}

export function CookingMode({ recipeName, instructions, onClose }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Wake Lock API to keep screen on while cooking
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Wake Lock not supported or denied
      }
    }

    requestWakeLock();

    // Re-acquire on visibility change
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      wakeLock?.release();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const toggleComplete = useCallback(() => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(currentStep)) {
        next.delete(currentStep);
      } else {
        next.add(currentStep);
      }
      return next;
    });
  }, [currentStep]);

  const goNext = useCallback(() => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, instructions.length]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Enter") toggleComplete();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, toggleComplete, onClose]);

  const step = instructions[currentStep];
  const isComplete = completedSteps.has(currentStep);
  const allDone = completedSteps.size === instructions.length;

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <p className="text-[10px] font-black text-[#f59e0b] tracking-[0.3em] uppercase">COOKING MODE</p>
          <p className="text-white/60 text-sm font-bold">{recipeName}</p>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 px-6 py-3">
        {instructions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 transition-colors ${
              completedSteps.has(i)
                ? "bg-[#0a4d33]"
                : i === currentStep
                ? "bg-[#f59e0b]"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Step number */}
          <div className={`${anton.className} text-[120px] leading-none text-white/10 mb-4`}>
            {currentStep + 1}
          </div>

          {/* Step title */}
          <h2 className={`${anton.className} text-3xl md:text-5xl text-white mb-8 uppercase`}>
            {step.title}
          </h2>

          {/* Step text - large for readability */}
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium">
            {step.text}
          </p>

          {/* Complete button */}
          <button
            onClick={toggleComplete}
            className={`mt-12 px-10 py-5 text-sm font-black uppercase tracking-widest transition-all ${
              isComplete
                ? "bg-[#0a4d33] text-white"
                : "bg-white/10 text-white hover:bg-[#f59e0b] hover:text-[#1a1a1a]"
            }`}
          >
            {isComplete ? (
              <span className="flex items-center gap-3"><Check size={20} /> DONE</span>
            ) : (
              "MARK AS DONE"
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-6 border-t border-white/10">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-black uppercase tracking-widest transition-colors ${
            currentStep === 0 ? "text-white/20" : "text-white hover:text-[#f59e0b]"
          }`}
        >
          <ChevronLeft size={20} /> PREV
        </button>

        <span className="text-white/40 text-sm font-bold">
          {currentStep + 1} / {instructions.length}
        </span>

        {currentStep === instructions.length - 1 ? (
          <button
            onClick={onClose}
            className={`px-8 py-4 text-sm font-black uppercase tracking-widest transition-colors ${
              allDone
                ? "bg-[#0a4d33] text-white"
                : "bg-[#f59e0b] text-[#1a1a1a]"
            }`}
          >
            {allDone ? "ALL DONE!" : "FINISH"}
          </button>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center gap-2 px-6 py-4 bg-[#f59e0b] text-[#1a1a1a] text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform"
          >
            NEXT <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
