"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import type { Theme } from "@/types";

function subscribeToMediaQuery(callback: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("curator-theme") as Theme) || "light";
}

export function useTheme() {
  const storedTheme = useSyncExternalStore(
    subscribeToMediaQuery,
    getStoredTheme,
    () => "light" as Theme
  );

  const [theme, setThemeState] = useState<Theme>(storedTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("curator-theme", t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return { theme, setTheme };
}
