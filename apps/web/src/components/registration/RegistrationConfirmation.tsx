import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { getButtonClasses } from "@/lib/button-styles";
import { ROUTES } from "@/routes/routes";
import { StepIndicator } from "@/components/registration/StepIndicator";

type RegistrationConfirmationProps = {
  totalSteps: number;
};

export function RegistrationConfirmation({
  totalSteps,
}: RegistrationConfirmationProps) {
  const { t } = useLanguage();
  const reg = t.registration!;

  return (
    <div className="mx-auto max-w-lg text-center">
      <StepIndicator currentStep={totalSteps + 1} totalSteps={totalSteps} />

      <div className="mx-auto mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
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
        <p className="text-sm text-[var(--rcb-text-muted)]">
          {reg.successNoNumber ?? "Commandez des autocollants dans la boutique pour recevoir votre numéro RNBP unique."}
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Link
          to={ROUTES.shop}
          className={getButtonClasses("primary")}
        >
          {t.shop?.heading ?? "Boutique"}
        </Link>
        <Link
          to={ROUTES.dashboard}
          className="text-sm font-medium text-[var(--rcb-primary)] hover:underline"
        >
          {reg.goToDashboard}
        </Link>
      </div>
    </div>
  );
}
