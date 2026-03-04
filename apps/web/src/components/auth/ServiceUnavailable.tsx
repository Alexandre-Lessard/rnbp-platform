import { useLanguage } from "@/i18n/context";

export function ServiceUnavailable() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--rcb-white)] px-4 text-center">
      <svg
        className="mb-6 h-16 w-16 text-[var(--rcb-text-muted)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
      <h2 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
        {t.errors?.serviceUnavailable ?? "Service temporairement indisponible"}
      </h2>
      <p className="mt-3 max-w-md text-lg text-[var(--rcb-text-muted)]">
        {t.errors?.serviceUnavailableDescription ??
          "Nos serveurs sont temporairement inaccessibles. Veuillez réessayer dans quelques instants."}
      </p>
    </div>
  );
}
