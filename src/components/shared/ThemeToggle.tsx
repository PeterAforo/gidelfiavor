"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-border)]/50"
        aria-label="Toggle theme"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-border)]/50 text-[var(--color-text)] transition-all hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent)]"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
