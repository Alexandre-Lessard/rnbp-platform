/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteContent } from "@/types/content";
import { defaultLocale, locales, type SupportedLocale } from "./locales";

type LanguageContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: SiteContent;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectLocale(): SupportedLocale {
  // SSR / build-time: no browser APIs available, default to FR (rnbp.ca primary domain)
  if (typeof window === "undefined") return defaultLocale;

  // 1. User's explicit choice (localStorage)
  const stored = localStorage.getItem("locale");
  if (stored && stored in locales) return stored as SupportedLocale;

  // 2. Hostname-based default (rnbp.ca → FR, nrpp.ca → EN)
  const hostname = window.location.hostname;
  if (hostname.includes("nrpp")) return "en";
  if (hostname.includes("rnbp")) return "fr";

  // 3. Browser language
  const browserLang = navigator.language.slice(0, 2);
  if (browserLang in locales) return browserLang as SupportedLocale;

  return defaultLocale;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(detectLocale);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  useEffect(() => {
    document.documentElement.lang = locale === "fr" ? "fr-CA" : "en-CA";
  }, [locale]);

  return (
    <LanguageContext value={{ locale, setLocale, t: locales[locale] }}>
      {children}
    </LanguageContext>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
