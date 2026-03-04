import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { getButtonClasses } from "@/lib/button-styles";

type RegistrationConfirmationProps = {
  rcbpNumber: string;
};

export function RegistrationConfirmation({
  rcbpNumber,
}: RegistrationConfirmationProps) {
  const { t } = useLanguage();
  const reg = t.registration!;

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>

      <h2 className="mt-6 text-3xl font-bold text-[var(--rcb-text-strong)]">
        {reg.successHeading}
      </h2>
      <p className="mt-3 text-lg text-[var(--rcb-text-muted)]">
        {reg.successDescription}
      </p>

      <div className="mt-8 rounded-xl border border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-6">
        <p className="text-sm font-medium text-[var(--rcb-text-muted)]">
          {reg.rcbpNumberLabel}
        </p>
        <p className="mt-2 text-3xl font-bold tracking-wider text-[var(--rcb-primary)]">
          {rcbpNumber}
        </p>
      </div>

      <Link
        to="/tableau-de-bord"
        className={`${getButtonClasses("primary")} mt-8`}
      >
        {reg.goToDashboard}
      </Link>
    </div>
  );
}
