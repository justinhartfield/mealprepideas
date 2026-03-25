"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycle}
      className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
      title={`Theme: ${theme}`}
      aria-label={`Switch theme (current: ${theme})`}
    >
      {theme === "light" && <Sun size={18} />}
      {theme === "dark" && <Moon size={18} />}
      {theme === "system" && <Monitor size={18} />}
    </button>
  );
}
