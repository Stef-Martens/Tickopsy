"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until after client-side hydration
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Prevent hydration mismatch: render nothing or a neutral UI
    return <button className="px-3 py-2 rounded">…</button>;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-2 rounded bg-secondary text-secondary-foreground"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
