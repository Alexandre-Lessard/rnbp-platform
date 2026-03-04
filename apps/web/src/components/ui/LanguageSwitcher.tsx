import { useLanguage } from "@/i18n/context";
import { locales, type SupportedLocale } from "@/i18n/locales";

const localeLabels: Record<SupportedLocale, string> = {
  fr: "FR",
  en: "EN",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {(Object.keys(locales) as SupportedLocale[]).map((code, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 && <span className="text-[var(--rcb-text-light)]">/</span>}
          <button
            type="button"
            onClick={() => setLocale(code)}
            className={`cursor-pointer transition-colors ${
              code === locale
                ? "text-[var(--rcb-primary)] font-bold"
                : "text-[var(--rcb-text-light)] hover:text-[var(--rcb-text-strong)]"
            }`}
            aria-current={code === locale ? "true" : undefined}
          >
            {localeLabels[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
