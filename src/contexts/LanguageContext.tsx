import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { LangCode } from "@/i18n";

type LangItem = { code: string; name: string; native_name: string; is_default: number; is_visible: number };

interface LanguageContextType {
  currentLang: string;
  setLang: (code: string) => void;
  supportedLangs: LangItem[];
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [supportedLangs, setSupportedLangs] = useState<LangItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load languages from API
  useEffect(() => {
    fetch("/api/languages")
      .then(r => r.json())
      .then((data: LangItem[]) => {
        const visible = (data || []).filter(l => l.is_visible !== 0);
        if (visible.length === 0) {
          // Fallback: at least zh-CN
          visible.push({ code: "zh-CN", name: "简体中文", native_name: "简体中文", is_default: 1, is_visible: 1 });
          visible.push({ code: "en-US", name: "English", native_name: "English", is_default: 0, is_visible: 1 });
        }
        setSupportedLangs(visible);
        // Set default language from API
        const def = visible.find(l => l.is_default === 1);
        if (def && i18n.language !== def.code) {
          i18n.changeLanguage(def.code);
          localStorage.setItem("cloudnest-lang", def.code);
        }
      })
      .catch(() => {
        setSupportedLangs([
          { code: "zh-CN", name: "简体中文", native_name: "简体中文", is_default: 1, is_visible: 1 },
          { code: "en-US", name: "English", native_name: "English", is_default: 0, is_visible: 1 },
        ]);
      })
      .finally(() => setLoading(false));
  }, [i18n]);

  const setLang = useCallback(
    (code: string) => {
      i18n.changeLanguage(code);
      localStorage.setItem("cloudnest-lang", code);
    },
    [i18n]
  );

  return (
    <LanguageContext.Provider
      value={{
        currentLang: i18n.language,
        setLang,
        supportedLangs,
        loading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
