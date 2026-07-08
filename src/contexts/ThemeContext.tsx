import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type ThemeId = "dark" | "light";

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("cloudnest-theme");
  if (stored === "light" || stored === "dark") return stored;
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getStoredTheme);

  const applyTheme = useCallback((t: ThemeId) => {
    document.documentElement.setAttribute("data-theme", t);
    // Also toggle Tailwind 'dark' class so dark: variants work
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("cloudnest-theme", theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
